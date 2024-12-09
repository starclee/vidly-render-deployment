const mongoose = require("mongoose");
const Joi = require("joi");

let genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
});
const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  let schema = new Joi.object({
    name: Joi.string().min(3).max(12).required(),
  });

  let { error } = schema.validate(genre);
  return error;
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;
