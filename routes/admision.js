const express = require("express");
const router = express.Router();
const Admision = require("../modelo/Admision");

router.get("/", (req, res) => {
  res.render("admision");
});

router.post("/", async (req, res) => {
  try {
    await Admision.create(req.body);
    res.redirect("/admision");
  } catch (err) {
    res.status(500).send("Error al registrar la admisión");
  }
});

module.exports = router;
