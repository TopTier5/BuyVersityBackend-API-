import Joi from "joi";

export const signUpSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  role: Joi.string().valid("vendor", "user").default("user"),
  university: Joi.string().valid(
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
  "Other"
).required(),
contact: Joi.string().pattern(/^0[2354567][0-9]{8}$/).length(10).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});