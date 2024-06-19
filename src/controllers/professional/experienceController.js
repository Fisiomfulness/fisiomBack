const { NotFoundError } = require('#src/util/errors');
const Professional = require('#src/models/Profesional');

const addExperience = async (req, res) => {
  const { id } = req.params;
  const newExperience = req.body;

  const professional = await Professional.findById(id);
  if (!professional) throw new NotFoundError('Profesional no encontrado');

  professional.experience.push(newExperience);
  await professional.save();

  res.status(201).json({ professional });
};

const updateExperience = async (req, res) => {
  const { id, experienceId } = req.params;
  const updatedExperience = req.body;

  const professional = await Professional.findById(id);
  if (!professional) throw new NotFoundError('Profesional no encontrado');

  const experience = professional.experience.id(experienceId);
  if (!experience) throw new NotFoundError('Experiencia no encontrada');

  experience.set(updatedExperience);
  await professional.save();

  res.status(200).json({ professional });
};

const deleteExperience = async (req, res) => {
  const { id, experienceId } = req.params;

  const professional = await Professional.findById(id);
  if (!professional) throw new NotFoundError('Profesional no encontrado');

  const experience = professional.experience.id(experienceId);
  if (!experience) throw new NotFoundError('Experiencia no encontrada');

  professional.experience.remove({ _id: experienceId });
  await professional.save();

  res.status(200).json({ professional });
};

module.exports = {
  addExperience,
  updateExperience,
  deleteExperience,
};
