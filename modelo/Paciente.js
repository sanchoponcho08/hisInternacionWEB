const { DataTypes, Model } = require("sequelize");
const sequelize = require("./conexion");

class Paciente extends Model {}

Paciente.init(
  {
    nombre_completo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dni: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    sexo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
    },
    telefono: {
      type: DataTypes.STRING,
    },
    contacto_emergencia: {
      type: DataTypes.STRING,
    },
    obra_social: {
      type: DataTypes.STRING,
    },
    localidad: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Paciente",
    tableName: "pacientes",
    timestamps: false,
  }
);

const Admision = require("./Admision");
Paciente.hasMany(Admision, {
  foreignKey: "pacienteId",
  as: "admisiones",
});
Admision.belongsTo(Paciente, {
  foreignKey: "pacienteId",
});
module.exports = Paciente;
