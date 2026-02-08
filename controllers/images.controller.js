const cloudinary  = require("../config/cloudinary")


const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Image id is required' });
    }


    const result = await cloudinary.uploader.destroy(id);


    if (result.result === 'not found') {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ message: 'Deleted successfully', result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    destroy
}