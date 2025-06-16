
CREATE DATABASE IF NOT EXISTS `his_internacion` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `his_internacion`;


SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `evaluaciones_enfermeria`;
DROP TABLE IF EXISTS `internaciones`;
DROP TABLE IF EXISTS `camas`;
DROP TABLE IF EXISTS `habitaciones`;
DROP TABLE IF EXISTS `alas`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `pacientes`;


CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `rol_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL UNIQUE,
  `fecha_nacimiento` date NOT NULL,
  `sexo` enum('Masculino','Femenino','Otro') NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `localidad` varchar(100) DEFAULT NULL,
  `obra_social` varchar(100) DEFAULT NULL,
  `contacto_emergencia` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `alas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `habitaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero` varchar(10) NOT NULL,
  `capacidad` int(11) NOT NULL DEFAULT 2,
  `ala_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ala_id`) REFERENCES `alas` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `camas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero` int(11) NOT NULL,
  `estado` enum('libre','ocupada','mantenimiento') NOT NULL DEFAULT 'libre',
  `higienizada` tinyint(1) NOT NULL DEFAULT 1,
  `habitacion_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `internaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_ingreso` datetime NOT NULL,
  `fecha_alta` datetime DEFAULT NULL,
  `motivo` text DEFAULT NULL,
  `motivo_alta` text DEFAULT NULL,
  `derivado_guardia` tinyint(1) DEFAULT 0,
  `tipo_ingreso` enum('Programado','Derivacion','Emergencia','Cirugia') NOT NULL,
  `estado` enum('PENDIENTE','ACTIVA','FINALIZADA','CANCELADA') NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `cama_id` int(11) DEFAULT NULL,
  `medico_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`cama_id`) REFERENCES `camas` (`id`),
  FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `evaluaciones_enfermeria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `internacion_id` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT current_timestamp(),
  `presion_arterial` varchar(20) DEFAULT NULL,
  `frecuencia_cardiaca` int(11) DEFAULT NULL,
  `frecuencia_respiratoria` int(11) DEFAULT NULL,
  `temperatura` decimal(4,1) DEFAULT NULL,
  `saturacion_oxigeno` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`internacion_id`) REFERENCES `internaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;



INSERT INTO `roles` (`id`, `nombre_rol`) VALUES (1, 'Administrativo'), (2, 'Enfermeria'), (3, 'Medico');
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol_id`) VALUES (1, 'Admin General', 'admin@his.com', 'admin123', 1),(2, 'Juan Perez (Enfermero)', 'juan.perez@his.com', 'enfermero123', 2),(3, 'Ana Gomez (Doctora)', 'ana.gomez@his.com', 'medico123', 3);
INSERT INTO `pacientes` (`id`, `nombre_completo`, `dni`, `fecha_nacimiento`, `sexo`, `direccion`, `telefono`, `localidad`, `obra_social`, `contacto_emergencia`) VALUES (1, 'Florencia Bustamante', '45412456', '2002-06-13', 'Femenino', 'Av. Siempre Viva 742', '2664112233', 'La Punta', 'OSDE', 'Homero Simpson'),(2, 'Agustina Ledesma', '40451236', '1990-12-30', 'Femenino', 'Calle Falsa 123', '2664334455', 'San Luis', 'Swiss Medical', 'Gomez Addams'),(3, 'Kevin Garcia', '43490401', '2001-01-14', 'Masculino', 'Bv. Las Acacias 404', '2664556677', 'Potrero de los Funes', 'Dosep', 'Maria Garcia'),(4, 'Julieta Medina', '41999999', '1993-02-14', 'Femenino', 'Pje. Los Tilos 21', '2664889900', 'Juana Koslay', 'PAMI', 'Roberto Medina'),(5, 'Carlos Sosa', '30123456', '1983-05-20', 'Masculino', 'Ruta 3 Km 8', '2664123123', 'El Volcan', 'Galeno', 'Laura Pausini');
INSERT INTO `alas` (`id`, `nombre`) VALUES (1, 'Clínica Médica'), (2, 'Cirugía'), (3, 'Pediatría'), (4, 'Maternidad'), (5, 'Emergencia');
INSERT INTO `habitaciones` (`id`, `numero`, `capacidad`, `ala_id`) VALUES (101, 'C-101', 2, 1), (102, 'C-102', 2, 1),(201, 'Q-201', 1, 2), (202, 'Q-202', 2, 2),(301, 'P-301', 2, 3),(401, 'M-401', 1, 4),(501, 'E-501', 1, 5);
INSERT INTO `camas` (`id`, `numero`, `estado`, `higienizada`, `habitacion_id`) VALUES (1, 1, 'ocupada', 1, 101), (2, 2, 'libre', 1, 101),(3, 1, 'ocupada', 1, 201), (4, 2, 'libre', 0, 102),(5, 1, 'mantenimiento', 0, 102), (6, 1, 'libre', 1, 202),(7, 2, 'libre', 1, 202), (8, 1, 'libre', 1, 301),(9, 2, 'libre', 1, 301), (10, 1, 'ocupada', 1, 401),(11, 1, 'libre', 1, 501);
INSERT INTO `internaciones` (`id`, `fecha_ingreso`, `fecha_alta`, `motivo`, `tipo_ingreso`, `estado`, `paciente_id`, `cama_id`, `medico_id`) VALUES (1, '2025-06-16 10:00:00', NULL, 'Control de diabetes', 'Programado', 'ACTIVA', 1, 1, 3),(2, '2025-06-16 11:30:00', NULL, 'Postoperatorio apendicitis', 'Cirugia', 'ACTIVA', 2, 3, 3),(3, '2025-06-16 12:00:00', NULL, 'Trabajo de parto', 'Emergencia', 'ACTIVA', 4, 10, 3),(4, '2025-06-16 14:00:00', NULL, 'Observación por contusión', 'Derivacion', 'PENDIENTE', 3, NULL, 3),(5, '2025-06-15 08:00:00', '2025-06-16 18:00:00', 'Chequeo general', 'Programado', 'FINALIZADA', 5, NULL, 3);
INSERT INTO `evaluaciones_enfermeria` (`internacion_id`, `presion_arterial`, `frecuencia_cardiaca`, `frecuencia_respiratoria`, `temperatura`, `saturacion_oxigeno`, `observaciones`) VALUES (1, '130/85', 80, 18, 36.8, 98, 'Paciente estable, se administró medicación según indicación.'),(1, '125/80', 78, 18, 36.7, 99, 'Control de glucemia realizado. Paciente refiere sentirse bien.'),(2, '120/80', 75, 20, 37.0, 97, 'Curación de herida quirúrgica realizada sin complicaciones.'),(3, '135/90', 88, 22, 37.2, 99, 'Monitoreo fetal constante. Paciente refiere contracciones regulares.');


SET FOREIGN_KEY_CHECKS=1;
COMMIT;