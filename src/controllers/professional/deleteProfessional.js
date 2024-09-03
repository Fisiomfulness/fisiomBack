const Profesional = require('../../models/profesional/Profesional');
const { cloudinary } = require('../../config/cloudinaryConfig.js');

const deleteProfessional = async (req, res) => {
  const { id } = req.params;
  try {
    const professional = await Profesional.findByIdAndDelete(id);
    if (!professional) throw new Error('the professional does not exist');
    await cloudinary.uploader.destroy(professional.id_image);

    return res
      .status(200)
      .json({ message: `the professional with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  deleteProfessional,
};
