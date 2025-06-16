require("dotenv").config();
const express = require("express");
const app = express();
const sequelize = require("./modelo/Conexion");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// mensajes flash
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

//rutas
const pacientesRoutes = require("./routes/pacientes");
app.use("/pacientes", pacientesRoutes);
const admisionRoutes = require("./routes/admision");
app.use("/admision", admisionRoutes);
const internacionRoutes = require("./routes/internacion");
app.use("/internaciones", internacionRoutes);
const camasRoutes = require("./routes/camas");
app.use("/camas", camasRoutes);

//modelos
const Paciente = require("./modelo/Paciente");
const Internacion = require("./modelo/Internacion");
const Cama = require("./modelo/Cama");
const Habitacion = require("./modelo/Habitacion");
const Ala = require("./modelo/Ala");
const Medico = require("./modelo/Medico");
const EvaluacionEnfermeria = require("./modelo/EvaluacionEnfermeria");

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

Internacion.hasMany(EvaluacionEnfermeria, { foreignKey: "internacion_id" });
EvaluacionEnfermeria.belongsTo(Internacion, { foreignKey: "internacion_id" });

app.get("/", (req, res) => {
  res.render("index");
});

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("Base de datos sincronizada");
    app.listen(PORT, () => {
      console.log("Servidor funcionando en http://localhost:${PORT}");
    });
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos:", err);
  });
