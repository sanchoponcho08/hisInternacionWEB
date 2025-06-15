const { DataTypes, Model } = require("sequelize");
const sequelize = require("../modelo/conexion");
const Habitacion = require("./Habitacion");

class Cama extends Model {
  static async findAvailable(sexoPaciente) {
    const [camasDisponibles] = await sequelize.query(
      `
        SELECT 
            c.id, c.numero, c.estado, c.higienizada,
            h.id AS 'Habitacion.id', h.numero AS 'Habitacion.numero', h.capacidad AS 'Habitacion.capacidad',
            a.id AS 'Habitacion.Ala.id', a.nombre AS 'Habitacion.Ala.nombre'
        FROM camas c
        JOIN habitaciones h ON c.habitacion_id = h.id
        JOIN alas a ON h.ala_id = a.id
        WHERE 
            c.estado = 'libre' AND c.higienizada = true
            AND (
                -- Condición 1: La habitación tiene capacidad para 1 (el sexo no importa)
                h.capacidad = 1
                OR
                -- Condición 2: La habitación está completamente vacía (ambas camas libres)
                (
                    h.capacidad > 1 AND
                    NOT EXISTS (
                        SELECT 1 FROM camas c2 
                        JOIN internaciones i2 ON c2.id = i2.cama_id
                        WHERE c2.habitacion_id = c.habitacion_id AND i2.estado = 'ACTIVA'
                    )
                )
                OR
                -- Condición 3: La habitación está semi-ocupada por un paciente del MISMO sexo
                (
                    h.capacidad > 1 AND
                    EXISTS (
                        SELECT 1 FROM camas c3
                        JOIN internaciones i3 ON c3.id = i3.cama_id
                        JOIN pacientes p3 ON i3.paciente_id = p3.id
                        WHERE c3.habitacion_id = c.habitacion_id AND i3.estado = 'ACTIVA' AND p3.sexo = :sexoPaciente
                    )
                )
            )
    `,
      {
        replacements: { sexoPaciente: sexoPaciente },
        nest: true,
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return camasDisponibles;
  }

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
