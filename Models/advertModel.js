import { model, Schema } from "mongoose";
import normalize from "normalize-mongoose";

// 🎓 Allowed universities
const universities = [
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
];

// 🗂️ Allowed categories
const categories = [
  'Electronics',
  'Clothing & Accessories',
  'Hostel Essentials',
  'Books',
  'Other'
];

// 📦 Advert schema
const advertSchema = new Schema({
  title:       { type: String, required: true },
  category:    { type: String, enum: categories, required: true },
  description: { type: String, required: true },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: arr => Array.isArray(arr) && arr.length > 0,
      message: "At least one image is required"
    }
  },
  university:  { type: String, enum: universities, required: true },
  location:    { type: String, required: true },
  vendorId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
  price:       { type: Number, required: true },
  condition:   { type: String, enum: ['New', 'Used'], required: true },
  datePosted:  { type: Date, default: Date.now },
  views:       { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

// 🔡 Normalize casing for dropdown fields
advertSchema.pre("save", function (next) {
  const toTitleCase = str =>
    str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

  if (this.category) this.category = toTitleCase(this.category);
  if (this.university) this.university = toTitleCase(this.university);

  next();
});

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
//   // contact: {
//   //   type: String,
//   //   required: true,
//   //   match: /^0[2354567][0-9]{8}$/,
//   //   minlength: 10,
//   //   maxlength: 10
//   // },
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




// // import { model, Schema } from "mongoose";
// // import normalize from "normalize-mongoose";

// // const advertSchema = new Schema({
// //   title:       { type: String, required: true },
// //   category:    {
// //     type: String,
// //     enum: ['Electronics', 'Clothing & Accessories', 'Hostel Essentials', 'Books', 'Other'],
// //     required: true
// //   },
// //   description: { type: String, required: true },
// //   images:      [{ type: String }],
// //   university:  {
// //     type: String,
// //     enum: [
// //       'University Of Ghana',
// //       'Kwame Nkrumah University of Science and Technology (KNUST)',
// //       'University of Cape Coast',
// //       'University of Education, Winneba',
// //       'University for Development Studies',
// //       'University of Mines and Technology',
// //       'University of Energy and Natural Resources',
// //       'University of Health and Allied Sciences',
// //       'Ashesi University',
// //       'Central University',
// //       'Pentecost University College',
// //       'Valley View University',
// //       'All Nations University',
// //       'Accra Institute of Technology',
// //       'Methodist University College',
// //       'Catholic University College of Ghana',
// //       'Presbyterian University College',
// //       'Other'
// //     ],
// //     required: true
// //   },
// //   datePosted:  { type: Date, default: Date.now },
// //   location:    { type: String, required: true },
// //   views:       { type: Number, default: 0 },
// //   vendorId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
// //   isActive:    { type: Boolean, default: true },
// //   contact:     {
// //     type: String,
// //     required: true,
// //     match: /^0[2354567][0-9]{8}$/,
// //     minlength: 10,
// //     maxlength: 10
// //   },
// //   price: {
// //     type: Number,
// //     required: true
// //   },
// //   condition: {
// //     type: String,
// //     enum: ['New', 'Used'],
// //     required: true
// //   }
// // }, { timestamps: true });

// // advertSchema.plugin(normalize);
// // export const Advert = model("Advert", advertSchema);




// // import { model, Schema } from "mongoose";
// // import normalize from "normalize-mongoose";

// // const advertSchema = new Schema({
// //   title:        { type: String, required: true },
// //   category:     { type: String, enum: ['Electronics', 'Clothing & Accessories', 'Hostel Essentials', 'Books', 'Other'], required: true },
// //   description:  { type: String, required: true },
// //   images:       [{ type: String }],
// //   university:   { type: String, enum: ['University Of Ghana', "Kwame Nkrumah University of Science and Technology (KNUST)", "University of Cape Coast", "University of Education, Winneba", "University for Development Studies", "University of Mines and Technology", "University of Energy and Natural Resources", "University of Health and Allied Sciences", "Ashesi University", "Central University", "Pentecost University College", "Valley View University", "All Nations University", "Accra Institute of Technology", "Methodist University College", "Catholic University College of Ghana", "Presbyterian University College", "Other"], required: true },
// //   datePosted:   { type: Date, default: Date.now },
// //   location:     { type: String, required: true },
// //   views:        { type: Number, default: 0 },
// //   vendorId:     { type: Schema.Types.ObjectId, ref: "User", required: true },
// //   isActive:     { type: Boolean, default: true },
// //   contact: {  type: String,  required: true, match: /^0[2354567][0-9]{8}$/, minlength: 10,
// //   maxlength: 10},
// // }, { timestamps: true });

// // advertSchema.plugin(normalize);
// // export const Advert = model("Advert", advertSchema);