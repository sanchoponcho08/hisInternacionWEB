const { DataTypes, Model } = require("sequelize");
const sequelize = require("./conexion");

class Habitacion extends Model {}

Habitacion.init(
  {
    numero: {
      type: DataTypes.STRING(10),
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
