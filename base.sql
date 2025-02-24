CREATE DATABASE IF NOT EXISTS agenda;
USE agenda;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    telefono VARCHAR(15),
    materia_grupo VARCHAR(100),
    rol VARCHAR(50) DEFAULT 'maestro',
    estado BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE grupos (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_grupo VARCHAR(100) NOT NULL,
    carrera VARCHAR(100),
    numero_alumnos INT,
    estado BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE horarios (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    dia VARCHAR(20) NOT NULL,
    id_usuario INT,
    id_grupo INT,
    estado BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo) ON DELETE CASCADE
);

CREATE TABLE horario_historial (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    dia VARCHAR(20) NOT NULL,
    cuatrimestre VARCHAR(30)NOT NULL,
    id_usuario INT,
    id_grupo INT,
    estado BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo) ON DELETE CASCADE
);

CREATE TABLE solicitudes (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    dia VARCHAR(20) NOT NULL,
    id_solicitante INT,
    id_grupo_nuevo INT,
    descripcion TEXT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_horario) REFERENCES horarios(id_horario) ON DELETE CASCADE,
    FOREIGN KEY (id_solicitante) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_grupo_nuevo) REFERENCES grupos(id_grupo) ON DELETE CASCADE
);

CREATE TABLE modificaciones (
    id_modificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_horario INT,
    maestro_nuevo INT,
    grupo_nuevo INT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (id_horario) REFERENCES horarios(id_horario) ON DELETE CASCADE,
    FOREIGN KEY (maestro_nuevo) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (grupo_nuevo) REFERENCES grupos(id_grupo) ON DELETE SET NULL
);

CREATE TABLE notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    emisor INT,
    receptor INT,
    descripcion TEXT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    FOREIGN KEY (emisor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (receptor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

--meter base:
INSERT INTO grupos (nombre_grupo, carrera, numero_alumnos, estado) VALUES
('8-A', 'Ingeniería en Sistemas', 30, 1),
('5-B', 'Administración de Empresas', 25, 1),
('2-C', 'Contaduría Pública', 28, 1);

INSERT INTO horarios (hora_inicio, hora_fin, dia, id_usuario, id_grupo, estado) VALUES
('07:00:00', '07:50:00', 'Lunes', 1, 1, 1),
('07:00:00', '07:50:00', 'Martes', 1, 2, 1),
('07:00:00', '07:50:00', 'Miércoles', 1, 3, 1);

INSERT INTO horario_historial (hora_inicio, hora_fin, dia, cuatrimestre, id_usuario, id_grupo, estado) VALUES
('07:00:00', '07:50:00', 'Lunes', 'Q1-2024', 1, 1, 1),
('07:00:00', '07:50:00', 'Martes', 'Q1-2024', 1, 2, 1),
('07:00:00', '07:50:00', 'Miércoles', 'Q1-2024', 1, 3, 1);

INSERT INTO solicitudes (id_horario, id_solicitante, id_grupo_nuevo, descripcion, estado) VALUES
(1, 1, 2, 'Cambio de horario por incompatibilidad', 'Pendiente'),
(2, 1, 3, 'Cambio de grupo por exceso de alumnos', 'Aprobado'),
(3, 1, 1, 'Cambio de horario por razones personales', 'Rechazado');

INSERT INTO modificaciones (id_horario, maestro_nuevo, grupo_nuevo, fecha_inicio, fecha_fin, estado) VALUES
(1, 1, 2, '2024-02-01', '2024-06-30', 1),
(2, 1, 3, '2024-02-01', '2024-06-30', 1),
(3, 1, 1, '2024-02-01', '2024-06-30', 1);

INSERT INTO notificaciones (emisor, receptor, descripcion, estado) VALUES
(1, 1, 'Se ha aprobado tu solicitud de cambio de grupo.', 'Leído'),
(1, 1, 'Tu horario ha sido modificado.', 'No leído'),
(1, 1, 'Tienes una nueva solicitud pendiente de aprobación.', 'No leído');



