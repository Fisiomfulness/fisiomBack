require("dotenv").config();
const jwt = require('jsonwebtoken');
const JWT_secret = process.env.JWT_secret;

const authAll = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    //console.log(token);
    jwt.verify(token, JWT_secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        next();
    });
}


module.exports = authAll;
