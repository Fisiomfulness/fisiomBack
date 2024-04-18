
const createProfessional = async (req, res) => {
    return res.status(400).json({ message: "please in order to register a new Professional use /register/profesional" });
};

module.exports = {
    createProfessional
};