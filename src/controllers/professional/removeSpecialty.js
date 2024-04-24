const Profesional = require('../../models/Profesional');
const Specialty = require('../../models/Specialty');

const removeSpecialty = async (req, res) => {
    try {
        const { profesional_id, specialty_id } = req.params;
        
        const profesional = await Profesional.findById(profesional_id);
        const specialty = await Specialty.findById(specialty_id);
        
        if (!profesional) {
            return res.status(404).json({ message: 'Professional not found' });
        }
        if (!specialty) {
            return res.status(404).json({ message: 'Specialty not found' });
        }
        if (!profesional.specialties.includes(specialty_id)) {
            return res.status(400).json({ message: "Professional doesn't have this specialty" });
        }

        profesional.specialties.pull(specialty_id);
        await profesional.save();

        try {
            specialty.professionals.pull(profesional_id);
            await specialty.save();
        } catch (error) {
            profesional.specialties.push(specialty_id);
            await profesional.save();
            return res.status(500).json({ message: error.message });
        }

        return res.status(200).send('Specialty removed successfully');

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { removeSpecialty };