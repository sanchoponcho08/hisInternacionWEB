const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/admision", (req, res) => {
  res.render("admision");
});

app.post("/admision", (req, res) => {
  console.log(req.body);
  res.send("Admisión registrada (simulado)");
});
app.get("/pacientes", (req, res) => {
  res.render("pacientes"); // luego será dinámico
});

app.get("/internacion", (req, res) => {
  res.render("internacion");
});
app.get("/camas", (req, res) => {
  res.render("camas");
});
app.use((req, res) => {
  res.status(404).render("error");
});
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
