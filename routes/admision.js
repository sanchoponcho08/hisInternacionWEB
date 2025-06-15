const express = require("express");
const router = express.Router();
const sequelize = require("../modelo/conexion");
const Paciente = require("../modelo/Paciente");
const Cama = require("../modelo/Cama");
const Internacion = require("../modelo/Internacion");

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
router.get("/internaciones/:id/asignar-cama", async (req, res) => {
  try {
    const internacion = await Internacion.findByPk(req.params.id, {
      include: Paciente,
    });

    if (!internacion) {
      return res.status(404).send("Internación no encontrada");
    }

    const camasDisponibles = await Cama.findAvailable(
      internacion.Paciente.sexo
    );

    res.render("admision/asignar_cama", {
      internacion: internacion,
      camas: camasDisponibles,
    });
  } catch (error) {
    console.error("Error al mostrar la página de asignación:", error);
    res.status(500).send("Error al mostrar la página de asignación");
  }
});

router.post("/internaciones/:id/asignar-cama", async (req, res) => {
  try {
    const internacionId = req.params.id;
    const camaId = req.body.cama_id;
    await sequelize.transaction(async (t) => {
      await Internacion.update(
        {
          cama_id: camaId,
          estado: "ACTIVA",
        },
        { where: { id: internacionId }, transaction: t }
      );

      await Cama.update(
        {
          estado: "ocupada",
        },
        { where: { id: camaId }, transaction: t }
      );
    });

    // mensaje confirmacion
    res.redirect("/admision");
  } catch (error) {
    console.error("Error al procesar la asignación de cama:", error);
    res.status(500).send("Error al procesar la asignación de cama");
  }
});

module.exports = router;
