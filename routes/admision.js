const express = require("express");
const router = express.Router();
const Admision = require("../modelo/Admision");
const Paciente = require("../modelo/Paciente");

router.get("/buscar", async (req, res) => {
  const { dni } = req.query;
  try {
    const paciente = await Paciente.findOne({ where: { dni } });
    res.json(paciente || {});
  } catch (error) {
    console.error("Error buscando paciente:", error);
    res.status(500).json({});
  }
});

router.post("/", async (req, res) => {
  try {
    await Admision.create({
      fecha_ingreso: req.body.fecha_ingreso,
      motivo: req.body.motivo,
      derivado_guardia: req.body.derivado_guardia === "on",
      pacienteId: parseInt(req.body.pacienteId, 10),
    });
    res.redirect("/admision");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al registrar la admisión");
  }
});

module.exports = router;
