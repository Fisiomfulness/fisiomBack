const moment = require('moment');
const { hashData } = require('../../util/hashData');
const Profesional = require('../../models/Profesional');

const createProfessional = async (req, res) => {
  try {
    const { password, email, birthDate, ...restData } = req.body;

    const emailVerify = await Profesional.findOne({ email });

    if (emailVerify) {
      return res.status(401).json({ message: 'este email ya existe' });
    } else {
      const hashedPass = await hashData(password);
      
      if (!moment(birthDate, 'YYYY-MM-DD', true).isValid()) {
        return res.status(401).json({
          message:
            'Formato de fecha de nacimiento no válido. Por favor usa YYYY-MM-DD.',
        });
      } else {
        const today = moment();
        const dateOfBirth = moment(birthDate);
        const age = today.diff(birthDate, 'years', true);

        if (age < 18) {
          return res.status(401).json({
            message: 'Necesitas tener 18 años o mas para registrarte.',
          });
        } else {
          restData.password = hashedPass;
          restData.birthDate = dateOfBirth;
          restData.email = email;

          const profesional = await Profesional.create(restData);
          return res.status(201).json({ profesional });
        }
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { createProfessional };
