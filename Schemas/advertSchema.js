import Joi from "joi";

export const advertSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().valid("Electronics", "Clothing & Accessories", "Hostel Essentials", "Books", "Other").required(),
  description: Joi.string().required(),
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
  "Other",
  ).required(),
  location: Joi.string().required()
});