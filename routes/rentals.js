const express = require("express");
const router = express.Router();
const { Rental, rentalValidation } = require("../models/rental");
const { Customer } = require("../models/cust");
const { Movie } = require("../models/movie");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental not found.");
  res.send(rental);
});

router.post("/create", async (req, res) => {
  try {
    const { error } = rentalValidation(req.body);
    if (error)
      return res.status(400).send({ message: error?.details?.[0]?.message });

    const customer = await Customer.findById(req.body.customerId);
    if (!customer)
      return res.status(404).send({ error: "Customer not found." });

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send({ error: "Movie not found." });

    if (movie.numberInStock === 0)
      return res.status(400).send({ error: "Movie not in stock." });

    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        mobileNo: customer.mobileNo,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    // Save rental and update movie stock
    await rental.save();
    movie.numberInStock -= 1;
    await movie.save();

    res.send(rental);
  } catch (e) {
    console.error("Error:", e);
    res.status(500).send("An error occurred.");
  }
});

module.exports = router;
