const Professional = require('#src/models/profesional/Profesional');

const approveProfessional = async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    professional.isApproved = true;
    await professional.save();

    res.status(200).json({ message: 'Professional approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { approveProfessional };
