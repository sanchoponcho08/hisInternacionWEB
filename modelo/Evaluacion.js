const { DataTypes, Model } = require("sequelize");
const sequelize = require("../modelo/conexion");

class Usuario extends Model {}

Usuario.init(
  {
    nombre_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: false,
  }
);

module.exports = Usuario;
