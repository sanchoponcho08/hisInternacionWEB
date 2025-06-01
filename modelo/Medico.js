const { DataTypes, Model } = require("sequelize");
const sequelize = require("./conexion");

class Medico extends Model {}

Medico.init(
  {
    nombre_completo: {
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
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Medico",
    tableName: "medicos",
  }
);

module.exports = Medico;
