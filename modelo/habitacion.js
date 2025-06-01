const { DataTypes, Model } = require("sequelize");
const sequelize = require("../modelo/conexion");

class Habitacion extends Model {}

Habitacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ala: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    piso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Habitacion",
    tableName: "habitaciones",
    timestamps: false,
  }
);

module.exports = Habitacion;
