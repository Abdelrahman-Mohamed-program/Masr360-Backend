

const Category = require("../models/Category");


const addOne = async(req,res,next)=>{
  try {
    const category =  new Category(req.body);
    await category.save()
    res.status(201).json(
category
    )
  } catch (error) {
    next(error)
  }
}
const getAll = async (req, res, next) => {
  try {
    let filter = {};
    
    // console.log(req.query);

      if (req.query.type) {
         filter.type = req.query.type
      }
     
      
     filter.lang = req.query.lang?req.query.lang.toUpperCase():"EN"
 
     console.log(req.query.lang);
     
      console.log(req.query.type);
      
const categories = await Category.aggregate([
  // Step 1: Only main categories (parents)
  { 
    $match: { 
      parent: null, 
      ...filter
    } 
  },

  // Step 2: Lookup subcategories
  {
    $lookup: {
      from: "categories",      // same collection
      localField: "_id",       // parent _id
      foreignField: "parent",  // subcategory parent field
      as: "subCategories"      // the new array field
    }
  },

]);

    res.status(200).json(categories);
  } catch (error) {
   next(error)
   
  }
};


const getOne = async(req,res,next)=>{
  try {
    const id = req.params.id;

    const categ = await Category.findById(id)
 
    if (!categ) {
      return res.status(404).json({
        message:"Not found"
      })
    }
       res.status(200).json(
        categ
      )
  } catch (error) {
    next(error)
  }
}

const updateOne = async (req,res,next)=>{
  try {
    const body = req.body;

    const updated = await Category.findByIdAndUpdate(req.params.id,body,{
new: true, runValidators: true
    })

    if (!updated) return res.status(404).json({ message: 'Not found' });
 
    res.status(200).json(
      updated
    )

  } catch (error) {
    next(error)
  }
}

const destroy = async (req,res,next)=>{
  try {
   
   const d = Category.findByIdAndDelete(req.params.id);

    if (!d) return res.status(404).json({ message: 'Not found' });
 
    res.status(200).json({
      message:"Deleted successfully"
    }
    )

  } catch (error) {
    next(error)
  }
}
module.exports = {getAll,getOne,updateOne,addOne,destroy}

