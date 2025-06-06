const { DataTypes, Model } = require("sequelize");
const sequelize = require("../modelo/conexion");

class Cama extends Model {}

Cama.init(
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
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    habitacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "habitaciones",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Cama",
    tableName: "camas",
    timestamps: false,
  }
);

module.exports = Cama;
