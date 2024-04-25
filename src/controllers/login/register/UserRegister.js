const moment = require('moment');
const User = require('#src/models/User');
const { hashData } = require('#src/util/hashData');

const UserRegister = async (req, res) => {
  try {
    const { password, email, dateOfBirth, ...restData } = req.body;

    const emailVerify = await User.findOne({ email });

    if (emailVerify) {
      res.status(401).send('este email ya existe');
    } else {
      const hashedPass = await hashData(password);

      if (!moment(dateOfBirth, 'YYYY-MM-DD', true).isValid()) {
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
          res
            .status(401)
            .send('Necesitas tener 18 años o mas para registrarte.');
        } else {
          restData.password = hashedPass;
          restData.birthDate = dateOfBirth;
          restData.email = email;

          await User.create(restData);
          res.status(201).send('creado con exito');
        }
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = UserRegister;

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
