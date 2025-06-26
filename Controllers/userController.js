import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../Models/userModel.js";
import { Advert } from "../Models/advertModel.js";
import { signUpSchema, loginSchema } from "../Schemas/userSchema.js";

export const signUp = async (req, res) => {
  const { error, value } = signUpSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = value;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 12);
  const newUser = await User.create({ ...value, password: hashed });

  // const token = jwt.sign(
  //   { id: newUser.id, role: newUser.role },
  //   process.env.JWT_SECRET,
  //   { expiresIn: "1h" }
  // );

  res.status(201).json({ user: newUser.id, });
};

export const loginUser = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(401).json({ message: "Invalid email or password" });

  const valid = await bcrypt.compare(value.password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

const currentUser = {
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  university: user.university,
  contact: user.contact
};

  res.json({ user:currentUser, token });
};

export const getVendorSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("firstName lastName email university contact createdAt role");

    if (!user || user.role !== "vendor") {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const adCount = await Advert.countDocuments({ vendorId: id });

    const summary = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      university: user.university,
      contact: user.contact,
      dateJoined: user.createdAt,
      totalAds: adCount
    };

    res.json({ vendorSummary: summary });
  } catch (error) {
    console.error("Error fetching vendor summary:", error.message);
    res.status(500).json({ message: "Server error while fetching vendor summary" });
  }
};


// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { User } from "../Models/userModel.js";
// import { signUpSchema, loginSchema } from "../Schemas/userSchema.js";

// // ✅ CHANGE: We now use process.env.JWT_SECRET instead of process.env.SECRET_KEY
// export const signUp = async (req, res) => {
//   const { error, value } = signUpSchema.validate(req.body);
//   if (error) return res.status(400).json({ error: error.details[0].message });

//   const { email, password } = value;
//   const existingUser = await User.findOne({ email });
//   if (existingUser) return res.status(409).json({ message: "User already exists" });

//   const hashed = await bcrypt.hash(password, 12);
//   const newUser = await User.create({ ...value, password: hashed });

//   // ✅ FIXED: Use JWT_SECRET from .env instead of SECRET_KEY
//   const token = jwt.sign(
//     { id: newUser.id, role: newUser.role },
//     process.env.JWT_SECRET, // ← this was previously incorrect
//     { expiresIn: "1h" }
//   );

//   res.status(201).json({ user: newUser, token });
// };

// export const loginUser = async (req, res) => {
//   const { error, value } = loginSchema.validate(req.body);
//   if (error) return res.status(400).json({ error: error.details[0].message });

//   const user = await User.findOne({ email: value.email });
//   if (!user) return res.status(401).json({ message: "Invalid email or password" });

//   const valid = await bcrypt.compare(value.password, user.password);
//   if (!valid) return res.status(401).json({ message: "Invalid email or password" });

//   // ✅ FIXED: Use JWT_SECRET from .env instead of SECRET_KEY
//   const token = jwt.sign(
//     { id: user.id, role: user.role },
//     process.env.JWT_SECRET, // ← this is the corrected line
//     { expiresIn: "1h" }
//   );

//   res.json({ user, token });
// };



// // import bcrypt from "bcrypt";
// // import jwt from "jsonwebtoken";
// // import { User } from "../Models/userModel.js";
// // import { signUpSchema, loginSchema } from "../Schemas/userSchema.js";

// // export const signUp = async (req, res) => {
// //   const { error, value } = signUpSchema.validate(req.body);
// //   if (error) return res.status(400).json({ error: error.details[0].message });

// //   const { email, password } = value;
// //   const existingUser = await User.findOne({ email });
// //   if (existingUser) return res.status(409).json({ message: "User already exists" });

// //   const hashed = await bcrypt.hash(password, 12);
// //   const newUser = await User.create({ ...value, password: hashed });

// //   const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
// //   res.status(201).json({ user: newUser, token });
// // };

// // export const loginUser = async (req, res) => {
// //   const { error, value } = loginSchema.validate(req.body);
// //   if (error) return res.status(400).json({ error: error.details[0].message });

// //   const user = await User.findOne({ email: value.email });
// //   if (!user) return res.status(401).json({ message: "Invalid email or password" });

// //   const valid = await bcrypt.compare(value.password, user.password);
// //   if (!valid) return res.status(401).json({ message: "Invalid email or password" });

// //   const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
// //   res.json({ user, token });
// // };