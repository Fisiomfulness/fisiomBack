const moment = require('moment');
const fs = require('node:fs/promises');
const { hashData } = require('#src/util/hashData');
const Profesional = require('#src/models/Profesional');
const {
  cloudinary,
  curriculumUploadOptions,
} = require('#src/config/cloudinaryConfig');

const profesionalRegister = async (req, res) => {
  try {
    const { password, email, dateOfBirth, ...restData } = req.body;
    const file = req.file.path;

    const emailVerify = await Profesional.findOne({ email });

    if (emailVerify) {
      await fs.unlink(file);
      res.status(401).send('este email ya existe');
    } else {
      const hashedPass = await hashData(password);

      if (!moment(dateOfBirth, 'YYYY-MM-DD', true).isValid()) {
        await fs.unlink(file);
        res
          .status(401)
          .send(
            'Formato de fecha de nacimiento no válido. Porfavor usa YYYY-MM-DD.',
          );
      } else {
        const today = moment();
        const birthDate = moment(dateOfBirth);
        const age = today.diff(birthDate, 'years', true);

        if (age < 18) {
          await fs.unlink(file);
          res
            .status(401)
            .send('Necesitas tener 18 años o mas para registrarte.');
        } else {
          const { secure_url } = await cloudinary.uploader.upload(
            file,
            curriculumUploadOptions,
          );

          restData.password = hashedPass;
          restData.birthDate = dateOfBirth;
          restData.email = email;
          restData.curriculum = secure_url;

          await Profesional.create(restData);

          await fs.unlink(file);

          res.status(201).send('creado con exito');
        }
      }
    }
  } catch (error) {
    res.status(500).send(error);
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
