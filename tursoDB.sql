CREATE TABLE usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_usuario VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    telefono VARCHAR(15),
    materia_grupo VARCHAR(100),
    rol VARCHAR(50) DEFAULT 'maestro',
    estado BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE grupos (
    id_grupo INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_grupo VARCHAR(100) NOT NULL,
    carrera VARCHAR(100),
    numero_alumnos INT,
    estado BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE horarios (
    id_horario INTEGER PRIMARY KEY AUTOINCREMENT,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    dia VARCHAR(20) NOT NULL,
    id_usuario INTEGER,
    id_grupo INTEGER,
    estado BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo) ON DELETE CASCADE
);

CREATE TABLE horario_historial (
    id_historial INTEGER PRIMARY KEY AUTOINCREMENT,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    dia VARCHAR(20) NOT NULL,
    cuatrimestre VARCHAR(30) NOT NULL,
    id_usuario INTEGER,
    id_grupo INTEGER,
    estado BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo) ON DELETE CASCADE
);

CREATE TABLE solicitudes (
    id_solicitud INTEGER PRIMARY KEY AUTOINCREMENT,
    id_horario INTEGER,
    id_solicitante INTEGER,
    id_grupo_nuevo INTEGER,
    descripcion TEXT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_horario) REFERENCES horarios(id_horario) ON DELETE CASCADE,
    FOREIGN KEY (id_solicitante) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_grupo_nuevo) REFERENCES grupos(id_grupo) ON DELETE CASCADE
);

CREATE TABLE modificaciones (
    id_modificacion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_horario INTEGER,
    maestro_nuevo INTEGER,
    grupo_nuevo INTEGER,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (id_horario) REFERENCES horarios(id_horario) ON DELETE CASCADE,
    FOREIGN KEY (maestro_nuevo) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (grupo_nuevo) REFERENCES grupos(id_grupo) ON DELETE SET NULL
);

CREATE TABLE notificaciones (
    id_notificacion INTEGER PRIMARY KEY AUTOINCREMENT,
    emisor INTEGER,
    receptor INTEGER,
    descripcion TEXT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    FOREIGN KEY (emisor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (receptor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);