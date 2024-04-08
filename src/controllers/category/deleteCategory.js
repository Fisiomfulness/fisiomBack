const Category = require('../../models/Category')

const deleteCategory = async (req, res)=> {
  try {
      const { id } = req.params
      const isRemovedCorrect = await Category.findOneAndRemove({_id:id})
      if (!isRemovedCorrect) throw new Error('the category does not exist')
      return res.status(200).json({message: `the category with id ${id} has been removed`})
  } catch (error) {
      return res.status(404).json({message: error.message})
  }
}

module.exports = {
  deleteCategory
}