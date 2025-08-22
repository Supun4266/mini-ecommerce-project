import productModel from "../../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

const toFiniteNumber = (v) => {
  if (v == null || v === "") return null; // treat empty as not-provided
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};


const getAllProducts = async (req,res) => {
    
    try {

        const productData = await productModel.find();

        res.status(200).json({success:true,productData});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const getProductsById = async (req,res) => {

    try {

        const { productId } = req.params;

        const product = await productModel.findById(productId);
        if(!product){
            return res.status(404).json({ success: false, message: "Product doesn't exist!"});
        }

        res.status(200).json({success:true,product});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const addProducts = async (req, res) => {
  try {
    const { name, description, price, stock} = req.body;
    const imageFile = req.file;

    // Basic required checks (explicit null/undefined checks)
    if (name == null || description == null || price == null || stock == null) {
      return res.status(400).json({ success: false, message: "Details missing. name, description, price, stock, imageUrl are required." });
    }

    if (!req.file) {
      return res.json({ success: false, message: "Image file is required" });
    }

    // Coerce and validate numbers
    const priceNum = toFiniteNumber(price);
    const stockNum = toFiniteNumber(stock);

    if (!Number.isFinite(priceNum) || priceNum < 0) {
      return res.status(400).json({ success: false, message: "Invalid price. Must bea non-negative number." });
    }
    if (!Number.isFinite(stockNum) || stockNum < 0) {
      return res.status(400).json({ success: false, message: "Invalid stock. Must be a non-negative number." });
    }

    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const image = imageUpload.secure_url;

    const productData = {
      name: String(name).trim(),
      description: String(description),
      price: priceNum,
      stock: stockNum,
      imageUrl: image,
    };

    const newProduct = new productModel(productData);
    await newProduct.save();

    return res.status(201).json({ success: true, message: "Product added!", product: newProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/productsController.js (updateProduct)
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, stock, existingImageUrl } = req.body;
    const imageFile = req.file; // may be undefined

    const productData = await productModel.findById(productId);
    if (!productData) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    // prepare update object only with provided fields
    const update = {};
    if (typeof name !== "undefined") update.name = name;
    if (typeof description !== "undefined") update.description = description;
    if (typeof price !== "undefined") update.price = price;
    if (typeof stock !== "undefined") update.stock = stock;

    // if a new file was uploaded -> upload to Cloudinary, set imageUrl
    if (imageFile) {
      try {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image",
        });
        update.imageUrl = imageUpload.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ success: false, message: "Image upload failed." });
      }
    } else if (existingImageUrl) {
      // client provided an existing image URL to keep/use
      update.imageUrl = existingImageUrl;
    }
    // else: no change to imageUrl (retain existing productData.imageUrl)

    const updated = await productModel.findByIdAndUpdate(productId, update, { new: true });
    return res.status(200).json({ success: true, message: "Product updated successfully!", product: updated });
  } catch (error) {
    console.error("updateProduct error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};




const deleteProduct = async (req,res) => {
    
    try {

        const { productId } = req.params;

         const productData = await productModel.findById(productId);

        if (!productData) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        await productModel.findByIdAndDelete(productId);

        res.status(200).json({success:true,message:"Product Deleted Successful!"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export {
    getAllProducts,
    getProductsById,
    addProducts,
    updateProduct,
    deleteProduct
}