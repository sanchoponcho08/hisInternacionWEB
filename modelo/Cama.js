const { DataTypes, Model } = require("sequelize");
const sequelize = require("../modelo/conexion");
const Habitacion = require("./habitacion");

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
      type: DataTypes.ENUM("libre", "ocupada", "higienizando"),
      allowNull: false,
      defaultValue: "libre",
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
