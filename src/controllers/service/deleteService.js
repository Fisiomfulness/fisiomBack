const { NotFoundError } = require('#src/util/errors');
const Service = require('#src/models/Service');

const deleteService = async (req, res) => {
  const { id } = req.params;

  const service = await Service.findByIdAndDelete(id);
  if (!service) throw new NotFoundError('Servicio no encontrado');

  res.status(200).json({ deleted: service, message: 'Servicio eliminado correctamente' });
};

module.exports = { deleteService };
