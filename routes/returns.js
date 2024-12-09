const validate = require("../middleware/validate");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  !req.body.customerId ? res.status(400).send("Customer Id not found") : "";
  !req.body.movieId ? res.status(400).send("Movie Id not found") : "";

  const rental = await Rental.lookup(req);

  if (!rental) return res.status(404).send("Rental not found..!");
  if (rental.dateReturned)
    return res.status(400).send("Rental has already been processed");

  rental.return();
  await rental.save();

  await Movie.findByIdAndUpdate(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );
  return res.send(rental);
});

function validateReturn(req) {
  let schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  let { error } = schema.validate(req);
  return error;
}

module.exports = router;
