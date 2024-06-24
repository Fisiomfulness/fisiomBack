const Appointment = require('../../models/Appointment');


const getAppointments = async (req, res) => {
    try {
        const { 
            from = '',
            to = '',
        } = req.query;

        const appointments = await Appointment.find({ _patient: req.user._id });
        return res.status(200).json(appointments);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}