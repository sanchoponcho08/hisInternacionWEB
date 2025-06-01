const { DataTypes, Model } = require("sequelize");
const sequelize = require("./conexion");

class Medico extends Model {}

Medico.init(
  {
    nombre_completo: { type: DataTypes.STRING, allowNull: false },
    dni: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    especialidad: { type: DataTypes.STRING, allowNull: false },
    matricula: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefono: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
  },
  {
    sequelize,
    modelName: "Medico",
    tableName: "medicos",
  }
);

module.exports = Medico;
