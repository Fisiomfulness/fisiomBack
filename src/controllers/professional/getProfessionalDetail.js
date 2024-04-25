const Profesional = require('../../models/Profesional');

const getProfessionalDetail = async (req, res) => {
  
  try {
    const { id } = req.params;
    const professional = await Profesional.findById(id)
    .populate('specialties', 'name')
    .populate({
      path: 'professionalScore',
      options: {
        sort: { createdDate: -1 }
      }
    })

    if (!professional) throw new Error('professional not found');

    return res.status(200).json({ professional });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
    getProfessionalDetail
};