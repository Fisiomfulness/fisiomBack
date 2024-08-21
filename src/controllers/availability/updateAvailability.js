const Availability = require('#src/models/profesional/availabilitySchema');

const updateAvailability = async (req, res) => {
  const { availability } = req.body;
  const { userId } = req.params;
  try {
    let userAvailability = await Availability.findOne({
      userId,
    });
    if (userAvailability) {
      userAvailability.availability = availability;
    } else {
      userAvailability = new Availability({
        userId,
        availability,
      });
    }
    await userAvailability.save();
    res.json({ message: 'Disponibilidad Actualizada', userAvailability });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = updateAvailability;
