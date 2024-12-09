const express = require("express");
const router = express.Router();
const { Movie, movieValidation } = require("../models/movie");
const { Genre } = require("../models/genre");
const errorMiddleware = require("../middleware/asyncError.js");

// router.get(
//   "/",
//   errorMiddleware(async (req, res) => {
//     const movie = await Movie.find();
//     console.log(`Movie:`, movie);
//     res.send(movie);
//   })
// );

router.get("/", async (req, res) => {
  throw new Error("Couldn't get movies from the db");
  const movie = await Movie.find();
  console.log(`Movie:`, movie);
  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("No movies found for given id");

  res.send(movie);
});

router.post("/", async (req, res) => {
  let error = movieValidation(req.body);
  if (error)
    return res
      .status(400)
      .send("movie validation : " + error?.details?.[0]?.message);

  let genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Invalid genre...");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  movie = await movie.save();

  res.send(movie);
});

router.put("/:id", async (req, res) => {
  let error = movieValidation(req.body);
  if (error) return res.status(400).send(error?.details?.[0]?.message);
  let genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("invalid genre");

  movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    {
      new: true,
    }
  );

  if (!movie) return res.status(404).send("No movies found for given id");

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) return res.status(404).send("No movies found for given id");

  res.send(movie);
});

module.exports = router;
