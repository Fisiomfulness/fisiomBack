const Service = require('#src/models/Service');

const createService = async (req, res) => {
  const { _professional, title, description, price, duration } = req.validatedBody;

  const newService = new Service(req.validatedBody);
  await newService.save();

  res.status(201).json({ newService, message: 'Servicio creado correctamente' });
};

module.exports = { createService };
