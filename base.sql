CREATE DATABASE IF NOT EXISTS agenda;
USE agenda;

CREATE TABLE Usuarios (
    Id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_usuario VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Contraseña VARCHAR(255) NOT NULL,
    Teléfono VARCHAR(15),
    Materia_grupo VARCHAR(100),
    Rol VARCHAR(50),
    Estado BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE Grupos (
    Id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_grupo VARCHAR(100) NOT NULL,
    Carrera VARCHAR(100),
    Numero_alumnos INT,
    Estado BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE Horarios (
    Id_horario INT AUTO_INCREMENT PRIMARY KEY,
    Hora_inicio TIME NOT NULL,
    Hora_fin TIME NOT NULL,
    Día VARCHAR(20) NOT NULL,
    Id_usuario INT,
    Id_grupo INT,
    Estado BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (Id_usuario) REFERENCES Usuarios(Id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (Id_grupo) REFERENCES Grupos(Id_grupo) ON DELETE CASCADE
);

CREATE TABLE Horario_historial (
    Id_historial INT AUTO_INCREMENT PRIMARY KEY,
    Hora_inicio TIME NOT NULL,
    Hora_fin TIME NOT NULL,
    Día VARCHAR(20) NOT NULL,
    Id_usuario INT,
    Id_grupo INT,
    Estado BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (Id_usuario) REFERENCES Usuarios(Id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (Id_grupo) REFERENCES Grupos(Id_grupo) ON DELETE CASCADE
);

CREATE TABLE Solicitudes (
    Id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    Id_horario INT,
    Id_solicitante INT,
    Id_grupo_nuevo INT,
    Descripción TEXT NOT NULL,
    Estado VARCHAR(50) NOT NULL,
    FOREIGN KEY (Id_horario) REFERENCES Horarios(Id_horario) ON DELETE CASCADE,
    FOREIGN KEY (Id_solicitante) REFERENCES Usuarios(Id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (Id_grupo_nuevo) REFERENCES Grupos(Id_grupo) ON DELETE CASCADE
);

CREATE TABLE Modificaciones (
    Id_modificacion INT AUTO_INCREMENT PRIMARY KEY,
    Id_horario INT,
    Maestro_nuevo INT,
    Grupo_nuevo INT,
    Fecha_inicio DATE NOT NULL,
    Fecha_fin DATE NOT NULL,
    Estado BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (Id_horario) REFERENCES Horarios(Id_horario) ON DELETE CASCADE,
    FOREIGN KEY (Maestro_nuevo) REFERENCES Usuarios(Id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (Grupo_nuevo) REFERENCES Grupos(Id_grupo) ON DELETE SET NULL
);

CREATE TABLE Notificaciones (
    Id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    Emisor INT,
    Receptor INT,
    Descripción TEXT NOT NULL,
    Estado VARCHAR(50) NOT NULL,
    FOREIGN KEY (Emisor) REFERENCES Usuarios(Id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (Receptor) REFERENCES Usuarios(Id_usuario) ON DELETE CASCADE
);
