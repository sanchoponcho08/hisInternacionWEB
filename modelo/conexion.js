const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("his_internacion", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log(" Conexión establecida con MySQL."))
  .catch((err) => console.error(" Error al conectar a la base de datos:", err));
