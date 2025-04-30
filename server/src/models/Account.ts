import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
})


export default mongoose.model('Account', AccountSchema);