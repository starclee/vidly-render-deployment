const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      default: 0,
      min: 0,
      max: 99,
    },
    dailyRentalRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 99,
    },
  })
);

function movieValidation(movie) {
  let schema = new Joi.object({
    title: Joi.string().min(1).max(50).required(),
    genreId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
  });

  let { error } = schema.validate(movie);
  return error;
}

exports.Movie = Movie;
exports.movieValidation = movieValidation;
