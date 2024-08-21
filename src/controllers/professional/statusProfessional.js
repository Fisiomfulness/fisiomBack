const Profesional = require('../../models/profesional/Profesional');

const statusProfessional = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (String(status) !== 'true' && String(status) !== 'false')
      throw new Error('the status(boolean) is required');

    const professional = await Profesional.findById(id);
    if (!professional) throw new Error('the professional does not exist');

    professional.status = status;
    await professional.save();

    const message = status
      ? 'Professional has been restored'
      : 'Professional has been deleted';

    return res.status(200).json({ message });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  statusProfessional,
};
