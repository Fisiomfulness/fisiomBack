const Appointment = require('#src/models/appointment/Appointment');

const updateAppointment = async (req, res) => {
  const { _id, ...restData } = req.body;
  try {
    const updated = await Appointment.findByIdAndUpdate(_id, restData, {
      new: true,
    });
    res
      .status(201)
      .json({ data: updated, message: 'Actualizado Exitosamente!' });
  } catch (error) {
    res.status(400).json({
      error,
      message: 'Ocurrio un error inesperado',
    });
  }
};

module.exports = {
  updateAppointment,
};
