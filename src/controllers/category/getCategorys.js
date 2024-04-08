const Category = require('../../models/Category')

const getCategorys = async (req, res)=> {
  try {
      const { name } = req.query
      const categories = await Category.find({})
      if (!name) return res.status(200).json({categories})
      const categoryFilter = categories.filter((cate) => 
          cate.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
      )

      if(!categoryFilter.length) throw new Error('no type found with that name')

      return res.status(200).json({categoryFilter})
  } catch (error) {
      return res.status(404).json({message: error.message})
  }
}

module.exports = {
  getCategorys
}