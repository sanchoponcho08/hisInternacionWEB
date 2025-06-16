const { DataTypes, Model } = require("sequelize");
const sequelize = require("./conexion");
const Habitacion = require("./Habitacion");

class Ala extends Model {}

Ala.init(
  {
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Ala",
    tableName: "alas",
    timestamps: false,
  }
);

module.exports = Ala;
