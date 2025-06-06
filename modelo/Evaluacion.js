const { DataTypes, Model } = require("sequelize");
const sequelize = require("./conexion");

class Evaluacion extends Model {}

Evaluacion.init(
  {
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("médica", "enfermería"),
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paciente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    medico_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    enfermero_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Evaluacion",
    tableName: "evaluaciones",
    timestamps: false,
  }
);

module.exports = Evaluacion;
