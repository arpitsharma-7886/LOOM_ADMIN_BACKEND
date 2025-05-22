import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },           
  description: { type: String, required: true },
  discountType: { type: String, enum: ["percentage", "flat"], required: true },
  discountValue: { type: Number, required: true },
  minimumPurchase: { type: Number, default: 0 },
  validFor: { type: String, enum: ["new", "all"], default: "all" },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
}, { timestamps: true });

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

export default PromoCode;
