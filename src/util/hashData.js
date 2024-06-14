const bcrypt = require("bcrypt")

const hashData = async (data, saltRounds = 10) => {
  try {
    const hashedData = await bcrypt.hash(data, saltRounds)
    return hashedData
  } catch (error) {
    throw error
  }
}

const verifyHashedData = async (unhashed, hashed) => {
  const isMatch = await bcrypt.compare(unhashed, hashed);
  return isMatch;
}

module.exports = { hashData, verifyHashedData }