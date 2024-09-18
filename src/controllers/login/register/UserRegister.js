const jwt = require('jsonwebtoken');

const { hashData } = require('#src/util/hashData');
const { JWT_SECRET, FRONT_URL } = require('#src/config/envConfig');
const { sendEmailNodemailer } = require('#src/util/nodemailer');
const User = require('#src/models/user/User');
const Profesional = require('#src/models/profesional/Profesional');

const UserRegister = async (req, res) => {
  try {
    const newData = req.validatedBody;

    // Valido si el código de país enviado es correcto
    const countryCode = newData.countryCode;
    if (!countryCodes.includes(countryCode)) {
      return res.status(400).json({ message: 'Código de país inválido' });
    }

    // nueva constante para almacenar el número de teléfono con el código de país
    const phoneWithCountryCode = `${countryCode}${newData.phone}`;

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

    if (userExist)
      return res.status(400).json({ message: 'Email ya registrado' });

    let userExistPhone = null;

    // Buscar usuarios y profesionales con el número de teléfono con el código de país

    await Promise.allSettled([
      User.findOne({ phone: phoneWithCountryCode }),
      Profesional.findOne({ phone: phoneWithCountryCode }),
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
      userExistPhone = firstNonNullUser?.user || null; // Manejar el caso nulo
    });

    if (userExistPhone)
      return res.status(400).json({ message: 'telefono ya registrado' });

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
