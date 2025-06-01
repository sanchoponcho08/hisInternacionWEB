const { DataTypes, Model } = require("sequelize");
const sequelize = require("./conexion");

class CamaEmergencia extends Model {}

CamaEmergencia.init(
  {
    numero_cama: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ala: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    habitacion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CamaEmergencia",
    tableName: "camas_emergencia",
    timestamps: false,
  }
);

module.exports = CamaEmergencia;
