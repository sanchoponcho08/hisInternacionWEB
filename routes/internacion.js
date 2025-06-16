const express = require("express");
const router = express.Router();
const sequelize = require("../modelo/conexion");
const Internacion = require("../modelo/Internacion");
const Paciente = require("../modelo/Paciente");
const Cama = require("../modelo/Cama");
const Habitacion = require("../modelo/Habitacion");
const Ala = require("../modelo/Ala");
const E = require("../modelo/Ala");
const EvaluacionEnfermeria = require("../modelo/EvaluacionEnfermeria");

router.get("/:id/asignar-cama", async (req, res) => {
  try {
    const internacion = await Internacion.findByPk(req.params.id, {
      include: Paciente,
    });
    if (!internacion) {
      return res.status(404).send("Internación no encontrada");
    }

    const camasDisponibles = await Cama.findAll({
      where: { estado: "libre", higienizada: true },
      include: {
        model: Habitacion,
        include: { model: Ala },
      },
    });

    res.render("admision/asignar_cama", {
      internacion: internacion,
      camas: camasDisponibles,
    });
  } catch (error) {
    console.error("Error al mostrar la página de asignación:", error);
    res.status(500).send("Error al mostrar la página de asignación");
  }
});

router.post("/:id/asignar-cama", async (req, res) => {
  try {
    const internacionId = req.params.id;
    const camaId = req.body.cama_id;

    await sequelize.transaction(async (t) => {
      await Internacion.update(
        { cama_id: camaId, estado: "ACTIVA" },
        { where: { id: internacionId }, transaction: t }
      );
      await Cama.update(
        { estado: "ocupada" },
        { where: { id: camaId }, transaction: t }
      );
    });

    req.flash(
      "success_msg",
      "¡Paciente internado y cama asignada correctamente!"
    );
    res.redirect("/admision");
  } catch (error) {
    console.error("Error al procesar la asignación de cama:", error);
    req.flash("error_msg", "Error al procesar la asignación de cama.");
    res.redirect("/admision");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const internacion = await Internacion.findByPk(req.params.id, {
      include: [
        { model: Paciente },
        {
          model: Cama,
          include: {
            model: Habitacion,
            include: { model: Ala },
          },
        },
        { model: EvaluacionEnfermeria, order: [["fecha_hora", "DESC"]] },
      ],
    });

    if (!internacion) {
      return res.status(404).send("Internación no encontrada");
    }
    res.render("internacion/detalle", { internacion });
  } catch (error) {
    console.error("Error al obtener el detalle de la internación:", error);
    res.status(500).send("Error interno del servidor");
  }
});

//evaluacionEnfermeria

router.post("/:id/evaluaciones", async (req, res) => {
  try {
    const internacionId = req.params.id;
    await EvaluacionEnfermeria.create({
      ...req.body,
      internacion_id: internacionId,
    });
    req.flash(
      "success_msg",
      "Evaluación de enfermería registrada correctamente."
    );

    res.redirect(`/internaciones/${internacionId}`);
  } catch (error) {
    console.error("Error al guardar la evaluación:", error);
    req.flash("error_msg", "Error al guardar la evaluación.");
    res.redirect(`/internaciones/${req.params.id}`);
  }
});

//alta medica

router.post("/:id/alta", async (req, res) => {
  try {
    const internacionId = req.params.id;
    const { fecha_alta, motivo_alta } = req.body;
    await sequelize.transaction(async (t) => {
      const internacion = await Internacion.findByPk(internacionId, {
        transaction: t,
      });
      if (!internacion || !internacion.cama_id) {
        throw new Error(
          "La internación no es válida o no tiene una cama asignada."
        );
      }
      await Internacion.update(
        {
          estado: "FINALIZADA",
          fecha_alta: fecha_alta,
        },
        {
          where: { id: internacionId },
          transaction: t,
        }
      );
      await Cama.update(
        {
          estado: "libre",
          higienizada: false,
        },
        {
          where: { id: internacion.cama_id },
          transaction: t,
        }
      );
    });

    req.flash(
      "success_msg",
      "Paciente dado de alta correctamente. La cama ha sido liberada."
    );
    res.redirect("/admision");
  } catch (error) {
    console.error("Error al dar de alta al paciente:", error);
    req.flash("error_msg", "Error al dar de alta al paciente.");
    res.redirect(`/internaciones/${req.params.id}`);
  }
});
module.exports = router;
