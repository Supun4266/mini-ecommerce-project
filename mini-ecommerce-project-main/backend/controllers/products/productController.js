import productModel from "../../models/productModel.js";

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
    const { name, description, price, stock, imageUrl } = req.body;

    // Basic required checks (explicit null/undefined checks)
    if (name == null || description == null || price == null || stock == null || imageUrl == null) {
      return res.status(400).json({ success: false, message: "Details missing. name, description, price, stock, imageUrl are required." });
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

    const productData = {
      name: String(name).trim(),
      description: String(description),
      price: priceNum,
      stock: stockNum,
      imageUrl: String(imageUrl).trim(),
    };

    const newProduct = new productModel(productData);
    await newProduct.save();

    return res.status(201).json({ success: true, message: "Product added!", product: newProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, stock, imageUrl } = req.body;

    const productData = await productModel.findById(productId);
    if (!productData) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    const update = {
      name, description, price, stock, imageUrl
    }

    const updated = await productModel.findByIdAndUpdate(productId, update, { new: true });
    return res.status(200).json({ success: true, message: "Product updated successfully!", product: updated });
  } catch (error) {
    console.error(error);
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