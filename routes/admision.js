const express = require("express");
const router = express.Router();
const Admision = require("../modelo/Admision");
const Paciente = require("../modelo/Paciente");
const Cama = require("../modelo/Cama");
const Habitacion = require("../modelo/habitacion");
const Ala = require("../modelo/ala");

Paciente.hasMany(Admision, { foreignKey: "pacienteId" });
Admision.belongsTo(Paciente, { foreignKey: "pacienteId" });

Cama.belongsTo(Habitacion, { foreignKey: "habitacion_id" });
Habitacion.hasMany(Cama, { foreignKey: "habitacion_id" });
Habitacion.belongsTo(Ala, { foreignKey: "ala_id" });
Ala.hasMany(Habitacion, { foreignKey: "ala_id" });

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
    res.status(500).send("Error al cargar formulario de admisión");
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      fecha_ingreso,
      motivo,
      derivado_guardia,
      tipo_ingreso,
      pacienteId,
    } = req.body;

    let paciente = await Paciente.findByPk(pacienteId);

    // Si es emergencia y no hay paciente seleccionado, crear uno vacío
    let nuevoPaciente = null;
    if (tipo_ingreso === "Emergencia" && !paciente) {
      nuevoPaciente = await Paciente.create({
        nombre_completo: "Paciente de emergencia",
        dni: null,
        sexo: null,
        fecha_nacimiento: null,
        direccion: null,
        telefono: null,
        contacto_emergencia: null,
        obra_social: null,
        localidad: null,
      });
    }

    const admision = await Admision.create({
      fecha_ingreso,
      motivo,
      derivado_guardia: derivado_guardia === "on",
      tipo_ingreso,
      pacienteId: nuevoPaciente ? nuevoPaciente.id : parseInt(pacienteId, 10),
    });

    // Si es emergencia, buscar cama en habitación del ala de emergencia
    if (tipo_ingreso === "Emergencia") {
      const camaDisponible = await Cama.findOne({
        where: { estado: "libre" },
        include: {
          model: Habitacion,
          include: {
            model: Ala,
            where: { nombre: "Emergencia" },
          },
        },
      });

      if (camaDisponible) {
        await camaDisponible.update({ estado: "ocupada" });
        await Internacion.create({
          fecha_ingreso,
          camaId: camaDisponible.id,
          admisionId: admision.id,
        });
      }
    }

    res.redirect("/admision");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al registrar la admisión");
  }
});

module.exports = router;
