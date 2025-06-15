const express = require("express");
const router = express.Router();
const sequelize = require("../modelo/conexion");
const Paciente = require("../modelo/Paciente");
const Cama = require("../modelo/Cama");
const Internacion = require("../modelo/Internacion");
const Habitacion = require("../modelo/Habitacion");
const Ala = require("../modelo/Ala");

router.get("/", async (req, res) => {
  try {
    const internaciones = await Internacion.findAll({
      include: [
        { model: Paciente },
        {
          model: Cama,
          include: [Habitacion],
        },
      ],
      order: [["fecha_ingreso", "DESC"]],
      // where: { estado: ['PENDIENTE', 'ACTIVA'] } filtrar solo activas
    });
    const pacientes = await Paciente.findAll({
      order: [["nombre_completo", "ASC"]],
    });
    res.render("admision", { internaciones, pacientes });
  } catch (error) {
    console.error("Error al cargar la página de admisión:", error);
    res.status(500).send("Error al cargar la página de admisión");
  }
});

router.post("/", async (req, res) => {
  try {
    const { dni_paciente, motivo, tipo_ingreso, derivado_guardia } = req.body;

    const paciente = await Paciente.findOne({ where: { dni: dni_paciente } });

    if (!paciente) {
      return res.redirect("/pacientes/new");
    }

    const nuevaInternacion = await Internacion.create({
      paciente_id: paciente.id,
      fecha_ingreso: new Date(),
      motivo: motivo,
      tipo_ingreso: tipo_ingreso,
      derivado_guardia: derivado_guardia === "on",
      estado: "PENDIENTE",
      cama_id: null,
    });

    res.redirect(`/internaciones/${nuevaInternacion.id}/asignar-cama`);
  } catch (err) {
    console.error("Error al registrar la admisión:", err);
    res.status(500).send("Error al registrar la admisión");
  }
});

module.exports = router;
