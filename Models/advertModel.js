import { model, Schema } from "mongoose";
import normalize from "normalize-mongoose";

const advertSchema = new Schema({
  title:        { type: String, required: true },
  category:     { type: String, enum: ['Electronics', 'Clothing & Accessories', 'Hostel Essentials', 'Books', 'Other'], required: true },
  description:  { type: String, required: true },
  images:       [{ type: String }],
  university:   { type: String, enum: ['University Of Ghana, Legon', 'University of Cape Coast'], required: true },
  datePosted:   { type: Date, default: Date.now },
  location:     { type: String, required: true },
  views:        { type: Number, default: 0 },
  vendorId:     { type: Schema.Types.ObjectId, ref: "User", required: true },
  isActive:     { type: Boolean, default: true }
}, { timestamps: true });

advertSchema.plugin(normalize);
export const Advert = model("Advert", advertSchema);