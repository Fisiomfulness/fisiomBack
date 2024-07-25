const Availability = require('#src/models/profesional/availabilitySchema');

const updateAvailability = async (req, res) => {
  const { availability } = req.body;
  const { userId } = req.params;
  try {
    let userAvailability = await Availability.findOne({
      userId,
    });
    if (userAvailability) {
      const newAvailability = await Availability.findByIdAndUpdate(
        userId,
        availability,
      );
      res.status(200).json(newAvailability);
    } else {
      const newAvailability = await Availability.create({
        userId,
        availability,
      });
      res
        .status(200)
        .json({ availability: newAvailability, message: 'creado con exixo!' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = updateAvailability;
