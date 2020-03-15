import joi from "@hapi/joi";

const AMOUNT_REGEX = /^\d+(\.\d+)?$/;

export const constructorSchema = joi.object({
  key: Joi.string()
    .max(256)
    .required()
});

export const placeOrderSchema = joi.object({
  pair: joi
    .string()
    .uppercase()
    .required(),
  side: joi
    .string()
    .lowercase()
    .valid("ask", "bid")
    .required(),
  price: joi
    .string()
    .max(64)
    .regex(AMOUNT_REGEX)
    .required(),
  amount: joi
    .string()
    .max(64)
    .regex(AMOUNT_REGEX)
    .required()
});

export const getOrderSchema = joi.object({
  orderId: joi.string().required()
});

export const cancelOrderSchema = joi.object({
  orderId: joi.string().required()
});
