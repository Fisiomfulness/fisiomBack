const { NotFoundError } = require('#src/util/errors');
const Service = require('#src/models/Service');

const updateService = async (req, res) => {
  const { id } = req.params;

  const service = await Service.findByIdAndUpdate(id, req.validatedBody, { new: true });
  if (!service) throw new NotFoundError('Servicio no encontrado');

  res.status(201).json({ updated: service, message: 'Servicio actualizado' });
};

module.exports = { updateService };
