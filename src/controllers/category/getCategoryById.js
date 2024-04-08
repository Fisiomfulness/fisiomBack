const Category = require('../../models/Category')

const getCategoryById = async (req, res)=> {
  try {
      const { id } = req.params
      const category = await Category.findById(id)
      if (!category) throw new Error('category not found')
      return res.status(200).json({category})
  } catch (error) {
      return res.status(404).json({message: error.message})
  }
}

module.exports = {
  getCategoryById
}