const { DataTypes, Model } = require("sequelize");
const sequelize = require("./Conexion");
const Paciente = require("./Paciente");
const Cama = require("./Cama");
const Medico = require("./Medico");

class Internacion extends Model {}

Internacion.init(
  {
    fecha_ingreso: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_alta: {
      type: DataTypes.DATE,
      allowNull: true, // Podria ser nulo hasta que se de el alta
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    derivado_guardia: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tipo_ingreso: {
      type: DataTypes.ENUM("Programado", "Derivacion", "Emergencia"),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("PENDIENTE", "ACTIVA", "FINALIZADA", "CANCELADA"),
      allowNull: false,
      defaultValue: "PENDIENTE",
    },
  },
  {
    sequelize,
    modelName: "Internacion",
    tableName: "internaciones",
    timestamps: false,
  }
);

module.exports = Internacion;
