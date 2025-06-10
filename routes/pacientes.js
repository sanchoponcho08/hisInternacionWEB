const express = require("express");
const router = express.Router();
const Paciente = require("../modelo/Paciente");

router.get("/", async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.render("pacientes", { pacientes });
  } catch (err) {
    console.error("Error al hacer findAll de pacientes:", err);
    res.status(500).send("Error al cargar pacientes");
  }
});

router.post("/", async (req, res) => {
  try {
    await Paciente.create(req.body);
    res.redirect("/pacientes");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar paciente");
  }
});

router.get("/editar/:dni", async (req, res) => {});

router.delete("/eliminar/:dni", async (req, res) => {
  try {
    await Paciente.destroy({ where: { dni: req.params.dni } });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
