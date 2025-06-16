const express = require("express");
const router = express.Router();
const Ala = require("../modelo/Ala");
const Habitacion = require("../modelo/habitacion");
const Cama = require("../modelo/Cama");

Ala.hasMany(Habitacion, { foreignKey: "ala_id" });
Habitacion.belongsTo(Ala, { foreignKey: "ala_id" });

Habitacion.hasMany(Cama, { foreignKey: "habitacion_id" });
Cama.belongsTo(Habitacion, { foreignKey: "habitacion_id" });

router.get("/", async (req, res) => {
  try {
    const alas = await Ala.findAll({
      include: {
        model: Habitacion,
        include: Cama,
      },
    });
    res.render("camas", { alas });
  } catch (error) {
    console.error("Error cargando camas:", error);
    res.status(500).send("Error al cargar el estado de camas");
  }
});

module.exports = router;
