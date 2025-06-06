const express = require("express");
const router = express.Router();
const Paciente = require("../models/Paciente");

router.get("/registrar", async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.render("pacientes", { pacientes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar pacientes");
  }
});

router.post("/registrar", async (req, res) => {
  try {
    await Paciente.create(req.body);
    res.redirect("/pacientes/registrar");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar paciente");
  }
});

module.exports = router;

module.exports = router;
