const express = require("express");
const app = express();
const sequelize = require("./modelo/conexion");
const path = require("path");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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
app.use("/internacion", internacionRoutes);
const camasRoutes = require("./routes/camas");
app.use("/camas", camasRoutes);

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
