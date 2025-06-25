import { model, Schema } from "mongoose";
import normalize from "normalize-mongoose";

const advertSchema = new Schema({
  title:       { type: String, required: true },
  category:    {
    type: String,
    enum: ['Electronics', 'Clothing & Accessories', 'Hostel Essentials', 'Books', 'Other'],
    required: true
  },
  description: { type: String, required: true },
  images:      [{ type: String }],
  university:  {
    type: String,
    enum: [
      'University Of Ghana',
      'Kwame Nkrumah University of Science and Technology (KNUST)',
      'University of Cape Coast',
      'University of Education, Winneba',
      'University for Development Studies',
      'University of Mines and Technology',
      'University of Energy and Natural Resources',
      'University of Health and Allied Sciences',
      'Ashesi University',
      'Central University',
      'Pentecost University College',
      'Valley View University',
      'All Nations University',
      'Accra Institute of Technology',
      'Methodist University College',
      'Catholic University College of Ghana',
      'Presbyterian University College',
      'Other'
    ],
    required: true
  },
  datePosted:  { type: Date, default: Date.now },
  location:    { type: String, required: true },
  views:       { type: Number, default: 0 },
  vendorId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
  isActive:    { type: Boolean, default: true },
  // contact: {
  //   type: String,
  //   required: true,
  //   match: /^0[2354567][0-9]{8}$/,
  //   minlength: 10,
  //   maxlength: 10
  // },
  price: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    enum: ['New', 'Used'],
    required: true
  }
}, { timestamps: true });

advertSchema.plugin(normalize);
export const Advert = model("Advert", advertSchema);




// import { model, Schema } from "mongoose";
// import normalize from "normalize-mongoose";

// const advertSchema = new Schema({
//   title:       { type: String, required: true },
//   category:    {
//     type: String,
//     enum: ['Electronics', 'Clothing & Accessories', 'Hostel Essentials', 'Books', 'Other'],
//     required: true
//   },
//   description: { type: String, required: true },
//   images:      [{ type: String }],
//   university:  {
//     type: String,
//     enum: [
//       'University Of Ghana',
//       'Kwame Nkrumah University of Science and Technology (KNUST)',
//       'University of Cape Coast',
//       'University of Education, Winneba',
//       'University for Development Studies',
//       'University of Mines and Technology',
//       'University of Energy and Natural Resources',
//       'University of Health and Allied Sciences',
//       'Ashesi University',
//       'Central University',
//       'Pentecost University College',
//       'Valley View University',
//       'All Nations University',
//       'Accra Institute of Technology',
//       'Methodist University College',
//       'Catholic University College of Ghana',
//       'Presbyterian University College',
//       'Other'
//     ],
//     required: true
//   },
//   datePosted:  { type: Date, default: Date.now },
//   location:    { type: String, required: true },
//   views:       { type: Number, default: 0 },
//   vendorId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
//   isActive:    { type: Boolean, default: true },
//   contact:     {
//     type: String,
//     required: true,
//     match: /^0[2354567][0-9]{8}$/,
//     minlength: 10,
//     maxlength: 10
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   condition: {
//     type: String,
//     enum: ['New', 'Used'],
//     required: true
//   }
// }, { timestamps: true });

// advertSchema.plugin(normalize);
// export const Advert = model("Advert", advertSchema);




// import { model, Schema } from "mongoose";
// import normalize from "normalize-mongoose";

// const advertSchema = new Schema({
//   title:        { type: String, required: true },
//   category:     { type: String, enum: ['Electronics', 'Clothing & Accessories', 'Hostel Essentials', 'Books', 'Other'], required: true },
//   description:  { type: String, required: true },
//   images:       [{ type: String }],
//   university:   { type: String, enum: ['University Of Ghana', "Kwame Nkrumah University of Science and Technology (KNUST)", "University of Cape Coast", "University of Education, Winneba", "University for Development Studies", "University of Mines and Technology", "University of Energy and Natural Resources", "University of Health and Allied Sciences", "Ashesi University", "Central University", "Pentecost University College", "Valley View University", "All Nations University", "Accra Institute of Technology", "Methodist University College", "Catholic University College of Ghana", "Presbyterian University College", "Other"], required: true },
//   datePosted:   { type: Date, default: Date.now },
//   location:     { type: String, required: true },
//   views:        { type: Number, default: 0 },
//   vendorId:     { type: Schema.Types.ObjectId, ref: "User", required: true },
//   isActive:     { type: Boolean, default: true },
//   contact: {  type: String,  required: true, match: /^0[2354567][0-9]{8}$/, minlength: 10,
//   maxlength: 10},
// }, { timestamps: true });

// advertSchema.plugin(normalize);
// export const Advert = model("Advert", advertSchema);