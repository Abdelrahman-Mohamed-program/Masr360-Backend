

const Category = require("../models/Category");
const subCategory = require("../models/Subcategory");
const getAll = async (req, res, next) => {
  try {
    let filter = {};
    
    if (req.query?.type) {
      filter.type = req.query.type;
    }

let categories = await Category.find(filter).lean();
let categoriesIds = categories.map(obj=>obj._id)
const subCategories = await subCategory.find().where("category").in(categoriesIds).lean();


categories = categories.map(obj => {
  
  const subCats = subCategories.filter(sub => sub.category.toString() === obj._id.toString());
  
  return {
    ...obj,
    subCategories: subCats
  };
});
    res.status(200).json(categories);
  } catch (error) {
   next(error)
   
  }
};


module.exports = {getAll}

