const { DataTypes, Model } = require("sequelize");
const sequelize = require("./conexion");
const Paciente = require("./Paciente");
const Cama = require("./Cama");
const Medico = require("./Medico");

class Internacion extends Model {}

Internacion.init(
  {
    fecha_ingreso: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_alta: {
      type: DataTypes.DATE,
      allowNull: true, // Podria ser nulo hasta que se de el alta
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    derivado_guardia: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tipo_ingreso: {
      type: DataTypes.ENUM("Programado", "Derivacion", "Emergencia"),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("PENDIENTE", "ACTIVA", "FINALIZADA", "CANCELADA"),
      allowNull: false,
      defaultValue: "PENDIENTE",
    },
  },
  {
    sequelize,
    modelName: "Internacion",
    tableName: "internaciones",
    timestamps: false,
  }
);

Internacion.belongsTo(Paciente, { foreignKey: "paciente_id" });
Paciente.hasMany(Internacion, { foreignKey: "paciente_id" });

Internacion.belongsTo(Cama, { foreignKey: "cama_id" });
Cama.hasOne(Internacion, { foreignKey: "cama_id" });

Internacion.belongsTo(Medico, { foreignKey: "medico_id" });
Medico.hasMany(Internacion, { foreignKey: "medico_id" });

module.exports = Internacion;
