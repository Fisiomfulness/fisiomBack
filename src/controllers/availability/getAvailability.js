const Availability = require('#src/models/profesional/availabilitySchema');

const getAvailability = async (req, res) => {
  const { userId } = req.params;
  try {
    const availability = await Availability.findOne({
      userId,
    });
    res.json(availability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = getAvailability;
