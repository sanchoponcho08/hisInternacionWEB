const { DataTypes, Model } = require("sequelize");
const sequelize = require("./conexion");
const Paciente = require("./Paciente");

class Admision extends Model {}

Admision.init(
  {
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    derivado_guardia: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Admision",
    tableName: "admisiones",
    timestamps: false,
  }
);

module.exports = Admision;
