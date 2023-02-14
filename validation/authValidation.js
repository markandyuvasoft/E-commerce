import { schema } from "../validation/authSchema.js";
import { cartSchema } from "../validation/authSchema.js";


// register validation
export const adduservali = async (req, res, next) => {

  const value = await schema.user.validate(req.body);

  if (value.error) {
    res.status(400).send({ message: value.error.details[0].message });
  } else {
    next();
  }
};


// add to cart validation
export const addcartvali = async (req, res, next) => {

  const values = await cartSchema.cart.validate(req.body);

  if (values.error) {
    res.status(400).send({ message: values.error.details[0].message });
  } else {
    next();
  }
};
