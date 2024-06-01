const jwt = require('jsonwebtoken');

const { hashData } = require('#src/util/hashData');
const { JWT_SECRET, FRONT_URL } = require('#src/config/envConfig');
const { sendEmailNodemailer } = require('#src/util/nodemailer');
const User = require('#src/models/User');
const Profesional = require('#src/models/Profesional');

const UserRegister = async (req, res) => {
  try {
    const newData = req.validatedBody;
    let userExist = null;

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
      userExist = firstNonNullUser?.user || null; // Manejar el caso nulo
    });

    if (userExist) return res.status(400).json({ message: 'Email ya registrado' });

    const hashedPass = await hashData(newData.password);
    const finalUser = {
      ...newData,
      password: hashedPass,
    };
    const newUser = await User.create(finalUser);

    let payload = {
      userId: newUser._id,
    };

    // * Crear email de confirmacion
    const tokenEmailConfirm = jwt.sign(payload, JWT_SECRET);
    const url = `${FRONT_URL}/confirmar_email/${tokenEmailConfirm}`;

    sendEmailNodemailer({
      to: newUser.email,
      subject: 'Confirmacion de cuenta - Fisium Fulness',
      html: `
          <p> Hola! ${newUser.name}, confirma la creacion de tu cuenta de Fisium Fulness</p>
          <p> Has click en este enlace para confirmar tu cuenta:
          <a href=${url} target="_blank"> Confirmar mi cuenta...</a></p>
          <p> Si tu no hiciste esta peticion, ignora este mensaje.</p>`,
    });

    res.status(201).json({ message: 'Creado con exito' });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Algo fallo...', errorMessage: error.message });
  }
};

module.exports = UserRegister;
