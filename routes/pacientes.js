const express = require("express");
const router = express.Router();
const Paciente = require("../modelo/Paciente");

//formulario
router.get("/registrar", (req, res) => {
  res.render("pacientes");
});

router.post("/registrar", async (req, res) => {
  try {
    await Paciente.create(req.body);
    res.redirect("/pacientes/registrar");
  } catch (error) {
    res.status(500).send("Error al registrar paciente");
  }
});

module.exports = router;
