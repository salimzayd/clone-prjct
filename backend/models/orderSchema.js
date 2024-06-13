import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({
    usermodel: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    products: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
    payment_id: String,
    total_amount: Number,
    date: { type: String, default: () => new Date().toLocaleDateString() },
}, { timestamps: true },{strictPopulate:false});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
