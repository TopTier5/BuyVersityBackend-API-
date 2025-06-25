import { model, Schema } from "mongoose";
import normalize from "normalize-mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role: {
    type: String,
    enum: ['vendor', 'user'],
    required: true},
    // default: 'user'
      university: {type: String,
        enum: [
      "University of Ghana",
      "Kwame Nkrumah University of Science and Technology (KNUST)",
      "University of Cape Coast",
      "University of Education, Winneba",
      "University for Development Studies",
      "University of Mines and Technology",
      "University of Energy and Natural Resources",
      "University of Health and Allied Sciences",
      "Ashesi University",
      "Central University",
      "Pentecost University College",
      "Valley View University",
      "All Nations University",
      "Accra Institute of Technology",
      "Methodist University College",
      "Catholic University College of Ghana",
      "Presbyterian University College",
      "Other"],
    required: 
      true},

    contact: {
  type: String,
  required: true,
  match: /^0[2354567][0-9]{8}$/,
  minlength: 10,
  maxlength: 10
},
  
}, { timestamps: true });

userSchema.plugin(normalize);
export const User = model("User", userSchema);