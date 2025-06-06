const { DataTypes, Model } = require("sequelize");
const sequelize = require("../modelo/conexion");

class Internacion extends Model {}

Internacion.init(
  {
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paciente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pacientes",
        key: "id",
      },
    },
    cama_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "camas",
        key: "id",
      },
    },
    medico_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "medicos",
        key: "id",
      },
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
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
