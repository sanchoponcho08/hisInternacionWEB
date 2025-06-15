const { DataTypes, Model } = require("sequelize");
const sequelize = require("../modelo/conexion");
const Internacion = require("./Internacion");

class Medico extends Model {}

Medico.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    especialidad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    matricula: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Medico",
    tableName: "medicos",
    timestamps: false,
  }
);

module.exports = Medico;
