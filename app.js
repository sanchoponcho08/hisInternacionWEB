const express = require("express");
const app = express();
const sequelize = require("./modelo/conexion");
const path = require("path");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//rutas
const pacientesRoutes = require("./routes/pacientes");
app.use("/pacientes", pacientesRoutes);
const admisionRoutes = require("./routes/admision");
app.use("/admision", admisionRoutes);
const internacionRoutes = require("./routes/internacion");
app.use("/internaciones", internacionRoutes);
const camasRoutes = require("./routes/camas");

//modelos
const Paciente = require("./modelo/Paciente");
const Internacion = require("./modelo/Internacion");
const Cama = require("./modelo/Cama");
const Habitacion = require("./modelo/Habitacion");
const Ala = require("./modelo/ala");
const Medico = require("./modelo/Medico");

//relaciones
Paciente.hasMany(Internacion, { foreignKey: "paciente_id" });
Internacion.belongsTo(Paciente, { foreignKey: "paciente_id" });

Medico.hasMany(Internacion, { foreignKey: "medico_id" });
Internacion.belongsTo(Medico, { foreignKey: "medico_id" });

Cama.hasOne(Internacion, { foreignKey: "cama_id" });
Internacion.belongsTo(Cama, { foreignKey: "cama_id" });

Habitacion.hasMany(Cama, { foreignKey: "habitacion_id" });
Cama.belongsTo(Habitacion, { foreignKey: "habitacion_id" });

Ala.hasMany(Habitacion, { foreignKey: "ala_id" });
Habitacion.belongsTo(Ala, { foreignKey: "ala_id" });

//rutas
app.use("/camas", camasRoutes);
app.get("/", (req, res) => {
  res.render("index");
});
sequelize
  .sync()
  .then(() => {
    console.log("Base de datos sincronizada");
    app.listen(3000, () => {
      console.log("Servidor funcionando en http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos:", err);
  });
