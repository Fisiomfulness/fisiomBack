const Type = require('../../models/Type');


const deleteType = async (req, res) => {
  const { id } = req.params;
  try {
    const isRemovedCorrect = await Type.findOneAndRemove({ _id: id });
    if (!isRemovedCorrect) throw new Error('the blog does not exist');

    return res
      .status(200)
      .json({ message: `the type with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


module.exports = {
  deleteType
}