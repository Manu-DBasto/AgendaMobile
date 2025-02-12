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
    id_usuario INT,
    id_grupo INT,
    estado BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo) ON DELETE CASCADE
);

CREATE TABLE solicitudes (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    id_horario INT,
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
