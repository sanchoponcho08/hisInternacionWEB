const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./conexion");

const Paciente = sequelize.define(
  "Paciente",
  {
    nombre_completo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dni: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    sexo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
    },
    telefono: {
      type: DataTypes.STRING,
    },
    contacto_emergencia: {
      type: DataTypes.STRING,
    },
    obra_social: {
      type: DataTypes.STRING,
    },
    localidad: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "pacientes",
    timestamps: false,
  }
);

module.exports = Paciente;
