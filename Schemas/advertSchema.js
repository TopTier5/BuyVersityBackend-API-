import Joi from "joi";

export const advertSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().valid("Electronics", "Clothing & Accessories", "Hostel Essentials", "Books", "Other").required(),
  description: Joi.string().required(),
  university: Joi.string().valid("University Of Ghana, Legon", "University of Cape Coast").required(),
  location: Joi.string().required()
});