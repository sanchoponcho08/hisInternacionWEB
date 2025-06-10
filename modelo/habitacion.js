const { DataTypes, Model } = require("sequelize");
const sequelize = require("../modelo/conexion");
const Ala = require("./ala");

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
    ala_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "alas",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Habitacion",
    tableName: "habitaciones",
    timestamps: false,
  }
);

Habitacion.belongsTo(Ala, { foreignKey: "ala_id" });
Ala.hasMany(Habitacion, { foreignKey: "ala_id" });

module.exports = Habitacion;
