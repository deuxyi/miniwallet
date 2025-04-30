import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  });
  
  export default mongoose.model('Transaction', TransactionSchema);