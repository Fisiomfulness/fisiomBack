const Appointment = require('#src/models/Appointment');

const deleteAppointment = async (req, res) => {
  const { _id } = req.params;
  try {
    await Appointment.findByIdAndDelete(_id, {
      new: true,
    });
    res.status(201).json({ message: 'Eliminado Exitosamente!' });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error,
      message: 'Ocurrio un error inesperado',
    });
  }
};

module.exports = {
  deleteAppointment,
};
