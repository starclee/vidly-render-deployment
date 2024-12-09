const express = require("express");
const router = express.Router();
const { Customer, validater } = require("../models/cust.js");

router.get("/", async (req, res) => {
  const customer = await Customer.find();
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("No customers found for given id");

  res.send(customer);
});

router.post("/create", async (req, res) => {
  const error = validater(req.body);
  if (error) return res.status(400).send(error?.details?.[0]?.message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    mobileNo: req.body.mobileNo,
  });

  try {
    customer = await customer.save();
    res.send(customer);
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
});

router.put("/:id", async (req, res) => {
  const error = validater(req.body);
  if (error) return res.status(400).send({ error: error?.details?.[0] });

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      mobileNo: req.body.mobileNo,
    },
    { new: true }
  );

  if (!customer) return res.status(404).send("Customer not found");
  res.send({
    message: "Customer data updated successfully",
    data: customer,
  });
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id, {
    new: true,
  });
  if (!customer) return res.status(404).send("Customer not found");
  res.send({
    message: "Customer data deleted successfully",
    data: customer,
  });
});

module.exports = router;
