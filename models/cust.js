const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 32,
      },
      isGold: {
        type: Boolean,
        required: false,
        default: false,
      },
      mobileNo: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^[6789]\d{9}$/.test(v);
          },
          message: (props) => `${props.value} is not valid`,
        },
      },
    },
    { versionKey: false }
  )
);

function validater(customer) {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(32).required(),
    isGold: Joi.boolean(),
    mobileNo: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .required(),
  });

  const { error } = schema.validate(customer);
  return error;
}

exports.Customer = Customer;
exports.validater = validater;
