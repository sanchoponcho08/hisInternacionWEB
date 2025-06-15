const express = require("express");
const router = express.Router();
const sequelize = require("../modelo/conexion");
const Paciente = require("../modelo/Paciente");
const Cama = require("../modelo/Cama");
const Internacion = require("../modelo/Internacion");
const Habitacion = require("../modelo/Habitacion");
const Ala = require("../modelo/ala");

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
  const { dni_paciente, motivo, tipo_ingreso, derivado_guardia } = req.body;
  if (tipo_ingreso === "Emergencia") {
    try {
      const internacionId = await sequelize.transaction(async (t) => {
        const pacienteTemporal = await Paciente.create(
          {
            nombre_completo: `Emergencia - ${Date.now()}`,
            dni: `E-${Date.now()}`,
            fecha_nacimiento: new Date(),
            sexo: "Otro",
          },
          { transaction: t }
        );

        const camaEmergencia = await Cama.findOne({
          where: { estado: "libre", higienizada: true },
          include: {
            model: Habitacion,
            required: true,
            include: {
              model: Ala,
              where: { nombre: "Emergencia" },
              required: true,
            },
          },
          transaction: t,
        });

        if (!camaEmergencia) {
          throw new Error("No hay camas disponibles en el área de Emergencia.");
        }
        const nuevaInternacion = await Internacion.create(
          {
            paciente_id: pacienteTemporal.id,
            cama_id: camaEmergencia.id,
            fecha_ingreso: new Date(),
            motivo: motivo || "Ingreso por Emergencia",
            tipo_ingreso: "Emergencia",
            estado: "ACTIVA",
            medico_id: null,
          },
          { transaction: t }
        );

        await camaEmergencia.update({ estado: "ocupada" }, { transaction: t });

        return nuevaInternacion.id;
      });

      req.flash(
        "success_msg",
        "Paciente de emergencia admitido y asignado a cama de Emergencia."
      );
      return res.redirect(`/internaciones/${internacionId}`);
    } catch (error) {
      console.error("Error en admisión de emergencia:", error);
      req.flash(
        "error_msg",
        error.message || "No se pudo procesar el ingreso de emergencia."
      );
      return res.redirect("/admision");
    }
  } else {
    try {
      const paciente = await Paciente.findOne({ where: { dni: dni_paciente } });
      if (!paciente) {
        req.flash(
          "error_msg",
          "El DNI no fue encontrado. Por favor, registre al nuevo paciente."
        );
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
  }
});

module.exports = router;
