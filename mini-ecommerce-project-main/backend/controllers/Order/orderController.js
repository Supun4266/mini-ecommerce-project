import orderItemModel from "../../models/orderItemModel.js";
import orderModel from "../../models/orderModel.js";
import productModel from "../../models/productModel.js";
import userModel from "../../models/userModel.js";

const addOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required in request body." });
    }

    const itemsArray = Array.isArray(items) ? items : [];
    if(!itemsArray){
        return res.status(404).json({ success: false, message: "Order Items are missing!"});
    }

    // create order with temporary total = 0
    const order = new orderModel({ userId, total: 0 });
    const savedOrder = await order.save();

    //build order items 
    const orderItemsToInsert = [];
    let total = 0;

    for (const it of itemsArray) {

      //get quantity
      const qty = Number(it.quantity) || 0;

      //get amount of the product
      const product = it.productId ? await productModel.findById(it.productId).lean() : null;

      //get price of the product
      const price = product?.price ?? 0;

      //calculate total
      total += price * qty;

      //push details to the array of items
      orderItemsToInsert.push({
        orderId: savedOrder._id,
        productId: it.productId ?? null,
        quantity: qty,
        price,
      });
    }

    //insert order items to the order Items model
    let createdOrderItems = [];
    if (orderItemsToInsert.length > 0) {
      createdOrderItems = await orderItemModel.insertMany(orderItemsToInsert);
    }

    //update order total
    savedOrder.total = total;
    await savedOrder.save();

    //reduce stock for each item
    for (const it of itemsArray) {
      const qty = Number(it.quantity) || 0;
      if (!it.productId || qty <= 0) continue;
      try {
        await productModel.findByIdAndUpdate(it.productId, { $inc: { stock: -qty } });
      } catch (err) {
        // log and continue; don't fail the whole request for a stock update error
        console.error("Failed to decrement stock for product", it.productId, err);
      }
    }

    //prepare response: populate items with basic product info and include user info
    const populatedItems = await orderItemModel.find({ orderId: savedOrder._id }).populate(
      "productId",
      "name description imageUrl price"
    );

    //get user info 
    const userInfo = await userModel.findById(userId).select("name email");

    return res.status(201).json({
      success: true,
      order: {
        ...savedOrder.toObject(),
        items: populatedItems,
        user: userInfo,
      },
    });
  } catch (error) {
    console.error("addOrder error:", error);
    return res.status(500).json({ success: false, message: "Server error creating order." });
  }
};

//admin
const getOrderDetails = async (req,res) => {
    
    try {

        const orderData = await orderModel.find();

        if( orderData.length === 0 ){
            res.status(200).json({ success: false, message: "No orders to display!." })
        }

        res.status(200).json({success:true,orderData});
        
    } catch (error) {
        console.error("getOrder error:", error);
        return res.status(500).json({ success: false, message: "Server error getting order." });
    }
};

//user
const getOrderDetailsUser = async (req,res) => {
    
    try {

        const { userId } = req.params;

        const orderData = await orderModel.find({userId})

        if( orderData.length === 0){
          res.status(200).json({ success: false, message: "No orders to display!." })
        }

        res.status(200).json({success:true,orderData});

        
    } catch (error) {
        console.error("getOrder error:", error);
        return res.status(500).json({ success: false, message: "Server error getting order." });
    }

}

export {
    addOrder,
    getOrderDetails,
    getOrderDetailsUser
}
