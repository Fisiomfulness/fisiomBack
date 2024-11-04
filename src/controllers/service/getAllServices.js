const { BadRequestError } = require('#src/util/errors');
const Service = require('#src/models/Service');
const Professional = require('#src/models/profesional/Profesional');

const LIMIT_SERVICES = 100;

const getAllServices = async (req, res) => {
  const {
    offset = 0,
    limit = LIMIT_SERVICES,
    page = 1,
    professionalId,
  } = req.query;

  const offsetInt = parseInt(offset);
  const limitInt = parseInt(limit);
  const pageInt = parseInt(page);

  if (
    !Number.isInteger(offsetInt) ||
    !Number.isInteger(limitInt) ||
    !Number.isInteger(pageInt)
  ) {
    throw new BadRequestError('"offset" | "limit" | "page" deben ser enteros');
  }

  const queryLimit =
    limitInt <= 0 ? LIMIT_SERVICES : Math.min(limitInt, LIMIT_SERVICES);
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
    .limit(queryLimit)
    .populate('_professional', 'name');

  const totalServices = await Service.countDocuments(query);
  const totalPages = Math.ceil(totalServices / queryLimit);
  const hasMoreToLoad = totalServices > offsetInt + queryLimit;

  res
    .status(200)
    .json({
      services,
      totalServices,
      page: pageInt,
      totalPages,
      hasMoreToLoad,
    });
};

module.exports = {
  getAllServices,
};

