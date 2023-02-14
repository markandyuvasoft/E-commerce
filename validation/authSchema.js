import joi from "@hapi/joi";

// add to register validation
export const schema = {
  user: joi.object({
    firstName: joi.string().max(100).required(),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "in"] } })
      .required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    cPassword: joi
      .any()
      .equal(joi.ref("password"))
      .required()
      .label("Confirm password")
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
  }),
};


// add to cart validation
export const cartSchema = {
  cart: joi
    .object({
      quantity: joi.number().integer().min(1).max(4).required(),
    })
    .options({ stripUnknown: true }),
};


