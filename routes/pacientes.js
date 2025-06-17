const express = require("express");
const router = express.Router();
const Paciente = require("../modelo/Paciente");
const Internacion = require("../modelo/Internacion");

router.get("/", async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      order: [["nombre_completo", "ASC"]],
    });
    res.render("pacientes", { pacientes });
  } catch (err) {
    console.error("Error al cargar la página de pacientes:", err);
    res.status(500).send("Error al cargar la página de pacientes");
  }
});

router.post("/", async (req, res) => {
  try {
    await Paciente.create(req.body);
    req.flash("success_msg", "Paciente registrado con éxito.");
    res.redirect("/pacientes");
  } catch (error) {
    console.error("Error al registrar paciente:", error);
    //manejo de posible error (dni duplicado)
    if (error.name === "SequelizeUniqueConstraintError") {
      req.flash("error_msg", "El DNI ingresado ya pertenece a otro paciente.");
    } else {
      req.flash("error_msg", "Error al registrar el paciente.");
    }
    res.redirect("/pacientes");
  }
});

router.post("/editar/:id", async (req, res) => {
  try {
    const pacienteId = req.params.id;
    await Paciente.update(req.body, {
      where: { id: pacienteId },
    });
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al actualizar el paciente:", error);
    res.sendStatus(500);
  }
});

router.delete("/eliminar/:id", async (req, res) => {
  try {
    const pacienteId = req.params.id;
    const count = await Internacion.count({
      where: { paciente_id: pacienteId },
    });

    if (count > 0) {
      return res
        .status(400)
        .send(
          "No se puede eliminar un paciente con historial de internaciones."
        );
    }

    // si hay una internacion relacionada no eliminara al paciente
    await Paciente.destroy({ where: { id: pacienteId } });
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al eliminar el paciente:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
