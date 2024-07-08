const { BadRequestError } = require('#src/util/errors');
const Service = require('#src/models/Service');
const Professional = require('#src/models/Profesional');

const LIMIT_SERVICES = 30;

const getAllServices = async (req, res) => {
  const { offset = 0, limit = LIMIT_SERVICES, professionalId } = req.query;

  const offsetInt = parseInt(offset);
  const limitInt = parseInt(limit);

  if (!Number.isInteger(offsetInt) || !Number.isInteger(limitInt)) {
    throw new BadRequestError('"offset" y "limit" deben ser enteros');
  }
  if (limitInt > LIMIT_SERVICES) throw new BadRequestError('"limit" excedido');

  let query = {};

  if (professionalId) {
    if (!(await Professional.findById(professionalId))) {
      throw new BadRequestError('Profesional no encontrado');
    }
    query._professional = professionalId;
  }

  const services = await Service.find(query)
    .sort({ title: 'asc' })
    .skip(offsetInt)
    .limit(limitInt);

  const totalServices = await Service.countDocuments(query);
  const hasMoreToLoad = totalServices > offsetInt + limitInt;

  res.status(200).json({ services, totalServices, hasMoreToLoad });
};

module.exports = {
  getAllServices,
};
