const mongoose = require("mongoose");
const Joi = require("joi");
const moment = require("moment");

// Define the rental schema
const rentalSchema = new mongoose.Schema(
  {
    customer: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 32,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      mobileNo: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^[6-9]\d{9}$/.test(v); // Ensure valid mobile number format
          },
          message: (props) => `${props.value} is not a valid mobile number.`,
        },
      },
    },
    movie: {
      _id: {
        type: mongoose.Schema.Types.ObjectId, // Correct reference type for ObjectId
        required: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 50,
      },
      numberInStock: {
        type: Number,
        min: 0,
        max: 99,
      },
      dailyRentalRate: {
        type: Number,
        min: 0,
        max: 99,
      },
    },
    dateOut: {
      type: Date,
      required: true,
      default: new Date(),
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  },
  { versionKey: false }
); // Disable the __v version key

rentalSchema.statics.lookup = function (req) {
  return this.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();
  let rentalDays = moment().diff(moment(this.dateOut), "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};
// Create the Rental model
const Rental = mongoose.model("Rental", rentalSchema);

// Joi validation schema for incoming requests
function rentalValidation(rental) {
  const schema = Joi.object({
    customerId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    movieId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });

  return schema.validate(rental);
}

module.exports = {
  Rental,
  rentalValidation,
};
