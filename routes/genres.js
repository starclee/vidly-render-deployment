const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateId = require("../middleware/validateObjectId");

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.status(200).send(genres);
});

router.get("/:id", validateId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send("No Genres found for given id");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  let error = validate(req.body);
  if (error) return res.status(400).send(error?.details?.[0]?.message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

router.put("/:id", [auth, validateId], async (req, res) => {
  let error = validate(req.body);
  if (error) return res.status(400).send(error?.details?.[0]?.message);

  genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
    }
  );

  if (!genre) return res.status(404).send("No Genres found for given id");

  res.send(genre);
});

router.delete("/:id", [auth, admin, validateId], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send("No Genres found for given id");

  res.send(genre);
});

module.exports = router;
