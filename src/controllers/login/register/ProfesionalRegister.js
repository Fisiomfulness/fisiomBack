const fs = require('node:fs/promises');
const jwt = require('jsonwebtoken');

const { hashData } = require('#src/util/hashData');
const {
  cloudinary,
  curriculumUploadOptions,
} = require('#src/config/cloudinaryConfig');
const { FRONT_URL, JWT_SECRET } = require('#src/config/envConfig');
const { sendEmailNodemailer } = require('#src/util/nodemailer');
const Profesional = require('#src/models/Profesional');
const User = require('#src/models/User');

const profesionalRegister = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'no se adjunto un curriculum' });
  }

  const file = req.file.path;

  try {
    const newData = req.validatedBody;
    let userExists = null;

    await Promise.allSettled([
      User.findOne({ email: newData.email }),
      Profesional.findOne({ email: newData.email }),
    ]).then((settElements) => {
      const usersMap = settElements.map((settElement, index) => {
        if (settElement.status === 'fulfilled' && settElement.value) {
          if (index === 0) {
            return { user: settElement.value };
          } else {
            return { user: settElement.value };
          }
        } else {
          return null;
        }
      });
      const firstNonNullUser = usersMap.filter((user) => user)[0];
      userExists = firstNonNullUser?.user || null; // Manejar el caso nulo
    });

    if (userExists) {
      await fs.unlink(file);
      return res.status(401).json({ message: 'este email ya existe' });
    }

    const { secure_url } = await cloudinary.uploader.upload(
      file,
      curriculumUploadOptions
    );

    const hashedPass = await hashData(newData.password);
    const finalProfessional = {
      ...newData,
      password: hashedPass,
      birthDate: newData.dateOfBirth,
      curriculum: secure_url,
    };
    const newProfesional = await Profesional.create(finalProfessional);

    let payload = {
      userId: newProfesional._id,
    };

    // * Crear email de confirmación
    const tokenEmailConfirm = jwt.sign(payload, JWT_SECRET);
    const url = `${FRONT_URL}/confirmar_email/${tokenEmailConfirm}`;

    sendEmailNodemailer({
      to: newProfesional.email,
      subject: 'Confirmación de cuenta - Fisiom Fulness',
      html: `
      <p> Hola! ${newProfesional.name}, confirma la creación de tu cuenta de Fisiom Fulness</p>
      <p> Has click en este enlace para confirmar tu cuenta:
      <a href=${url} target="_blank"> Confirmar mi cuenta...</a></p>
      <p> Si tu no hiciste esta petición, ignora este mensaje.</p>`,
    });

    await fs.unlink(file);
    res.status(201).json({ message: 'creado con éxito' });
  } catch (error) {
    await fs.unlink(file);
    res
      .status(500)
      .json({ message: 'Algo fallo...', errorMessage: error.message });
  }
};

module.exports = profesionalRegister;
