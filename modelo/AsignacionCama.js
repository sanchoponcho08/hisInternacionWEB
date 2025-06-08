const { DataTypes, Model } = require("sequelize");
const sequelize = require("./conexion");

class AsignacionCama extends Model {}

AsignacionCama.init(
  {
    paciente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cama_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_asignacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_liberacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "AsignacionCama",
    tableName: "asignaciones_camas",
    timestamps: false,
  }
);

module.exports = AsignacionCama;
