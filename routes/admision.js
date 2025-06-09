const express = require("express");
const router = express.Router();
const Admision = require("../modelo/Admision");
const Paciente = require("../modelo/Paciente");

router.get("/", async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      order: [["nombre_completo", "ASC"]],
    });
    const admisiones = await Admision.findAll({
      include: { model: Paciente },
      order: [["fecha_ingreso", "DESC"]],
    });

    res.render("admision", { pacientes, admisiones });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar formulario de admision");
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
