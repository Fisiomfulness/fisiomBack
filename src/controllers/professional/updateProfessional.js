const Profesional = require('../../models/Profesional');


const updateProfessional = async (req, res) => {
    try {
      const id = req.params.id;

    const professional = await Profesional.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
    if (!professional) throw new Error('product not found');

    return res.status(200).json({ professional });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  updateProfessional,
};