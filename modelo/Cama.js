const { DataTypes, Model } = require("sequelize");
const sequelize = require("../modelo/conexion");
const Habitacion = require("./Habitacion");

class Cama extends Model {
  /**
    Falta  filtrar por el sexo del otro paciente
   */
  static async findAvailable() {
    const camas = await Cama.findAll({
      where: {
        estado: "libre",
        higienizada: true,
      },
      include: {
        model: Habitacion,
        required: true,
      },
    });
    return camas;
  }
}
Cama.init(
  {
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Número de la cama dentro de la habitación (ej: 1, 2)",
    },
    estado: {
      type: DataTypes.ENUM("libre", "ocupada", "higienizando", "mantenimiento"),
      allowNull: false,
      defaultValue: "libre",
    },
    higienizada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "Indica si la cama está limpia y lista para usar",
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
