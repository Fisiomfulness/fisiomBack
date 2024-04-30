const moment = require('moment');
const fs = require('node:fs/promises');
const jwt = require('jsonwebtoken');

const Profesional = require('#src/models/Profesional');
const { hashData } = require('#src/util/hashData');
const {
  cloudinary,
  curriculumUploadOptions,
} = require('#src/config/cloudinaryConfig');
const { FRONT_URL, JWT_SECRET } = require('#src/config/envConfig');
const { sendEmailNodemailer } = require('#src/util/nodemailer');

const profesionalRegister = async (req, res) => {
  try {
    const { password, email, dateOfBirth, ...restData } = req.body;
    const file = req.file.path;

    const emailVerify = await Profesional.findOne({ email });

    if (emailVerify) {
      await fs.unlink(file);
      res.status(401).json({ message: 'este email ya existe' });
    } else {
      const hashedPass = await hashData(password);

      if (!moment(dateOfBirth, 'YYYY-MM-DD', true).isValid()) {
        await fs.unlink(file);
        res.status(401).json({
          message:
            'Formato de fecha de nacimiento no válido. Porfavor usa YYYY-MM-DD.',
        });
      } else {
        const today = moment();
        const birthDate = moment(dateOfBirth);
        const age = today.diff(birthDate, 'years', true);

        if (age < 18) {
          await fs.unlink(file);
          res.status(401).json({
            message: 'Necesitas tener 18 años o mas para registrarte.',
          });
        } else {
          const { secure_url } = await cloudinary.uploader.upload(
            file,
            curriculumUploadOptions,
          );

          restData.password = hashedPass;
          restData.birthDate = dateOfBirth;
          restData.email = email;
          restData.curriculum = secure_url;

          const newProfesional = await Profesional.create(restData);

          await fs.unlink(file);
          let payload = {
            userId: newProfesional._id,
          };

          const tokenEmailConfirm = jwt.sign(payload, JWT_SECRET);

          //crear email de confirmacion
          const url = `${FRONT_URL}/confirmar_email/${tokenEmailConfirm}`;

          sendEmailNodemailer({
            to: newProfesional.email,
            subject: 'Confirmacion de cuenta - Fisium Fulness',
            html: `
          <p> Hola! ${newProfesional.name}, confirma la creacion de tu cuenta de Fisium Fulness</p>
          <p> Has click en este enlace para confirmar tu cuenta:
          <a href=${url} target="_blank"> Confirmar mi cuenta...</a></p>
          <p> Si tu no hiciste esta peticion, ignora este mensaje.</p>`,
          });

          res.status(201).json({ message: 'creado con exito' });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = profesionalRegister;

// Envío del correo electrónico de confirmación
/*
    const emailConfirmation = async (data) => {
        const transport = nodemailer.createTransport({
            host: E_HOST,
            port: E_PORT,
            auth: {
                user: E_USER,
                pass: E_PASSWORD,
            },
        });
        const { username, email, token } = data;
        await transport.sendMail({
            from: "fisiumfulness",
            to: email,
            subject: "Confirm account",
            text: "Confirm account",
            html: `
        <p> Hi! ${username}, confirm account in Fisium Fulness </p>
        <p> Confirm your account in the link :
        <a href="http://localhost:5173/confirm/${token}"> Confirm Account </a></p>
        <p> If you didn't create the account, ignore it</p>`,
        });
    };

    emailConfirmation({
        username: newUser.username,
        email: newUser.email,
        token: newUser.token,
    });)*/
