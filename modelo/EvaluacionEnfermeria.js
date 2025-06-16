const { DataTypes, Model } = require("sequelize");
const sequelize = require("./conexion");

class EvaluacionEnfermeria extends Model {}

EvaluacionEnfermeria.init(
  {
    fecha_hora: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    presion_arterial: {
      type: DataTypes.STRING,
    },
    frecuencia_cardiaca: {
      type: DataTypes.INTEGER,
    },
    frecuencia_respiratoria: {
      type: DataTypes.INTEGER,
    },
    temperatura: {
      type: DataTypes.DECIMAL(4, 1),
    },
    saturacion_oxigeno: {
      type: DataTypes.INTEGER,
    },
    observaciones: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "EvaluacionEnfermeria",
    tableName: "evaluaciones_enfermeria",
    timestamps: false,
  }
);

module.exports = EvaluacionEnfermeria;
