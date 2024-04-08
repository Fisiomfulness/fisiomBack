const Category = require('../../models/Category')

const createCategory = async (req, res) => {
    try {
        const { name } = req.body
        const newCategory = new Category({name})
        await newCategory.save()
        return res.status(200).json({newCategory})
    } catch (error) {
        return res.status(404).json({message: error.message})
    }
}


module.exports = {
  createCategory
}