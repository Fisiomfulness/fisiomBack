const { JWT_SECRET } = require("../../config/envConfig");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" },
      );
      return res.status(200).json({ user, token });
    } else {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports = {
  login,
};
