const authAll = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorizedd' });
  }
  next();
};

module.exports = authAll;
