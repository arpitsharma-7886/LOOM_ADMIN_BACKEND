import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    // duration: {
    //   type: Number, // in days
    // },
    image: {
      type: String,
      required: true,
    },
    gif: {
      type: String, 
      required: false,
    },
    status: {
      type: String,
      enum: ['Active', 'InActive'],
      default: 'InActive'
    }
  },
  {
    strict: true,
    collection: "Banner",
    versionKey: false,
    timestamps: true,
  }
);

const BannerModel = mongoose.model("Banner", bannerSchema);

export default BannerModel;
