const { DataTypes, Model } = require("sequelize");
const sequelize = require("./conexion");

class Ala extends Model {}

Ala.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
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
