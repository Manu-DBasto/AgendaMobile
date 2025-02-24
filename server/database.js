import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const pool = mysql
    .createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    })
    .promise();

export async function login(email, password) {
    const [row] = await pool.query(`SELECT * FROM usuarios WHERE email = ?`, [
        email,
    ]);
    if (row.length > 0) {
        const user = row[0];
        const match = await bcrypt.compare(password, user.contraseña);
        if (match) {
            console.log("chi");
            return user;
        } else {
            throw new Error("Contraseña incorrecta");
        }
    } else {
        throw new Error("Usuario no encontrado");
    }
}

export async function registerUser(name, email, password, phone, subject) {
    // Verifica si el correo electrónico ya está registrado
    const [existingUser] = await pool.query(
        `SELECT * FROM usuarios WHERE email = ?`,
        [email]
    );

    if (existingUser.length > 0) {
        throw new Error("Correo electrónico ya está registrado");
    }

    // Si no existe, procede con el registro
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
        `INSERT INTO usuarios (nombre_usuario, email, contraseña, telefono, materia_grupo) VALUES (?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, phone, subject]
    );
    return result;
}

export async function getUsers(search = "") {
    const [rows] = await pool.query(
        `SELECT * FROM usuarios WHERE nombre_usuario LIKE ? OR email LIKE ? OR telefono LIKE ?`,
        [`%${search}%`, `%${search}%`, `%${search}%`]
    ); //En caso de ser vacio, se envia la busqueda como "...LIKE '%%'..."
    return rows;
}

export async function updateUser(id, name, email, phone, subject, rol, state) {
    await pool.query(
        "UPDATE usuarios SET nombre_usuario = ?, email = ?, telefono = ?, materia_grupo = ?, rol = ?, estado = ? WHERE id_usuario = ?",
        [name, email, phone, subject, rol, state, id]
    );
}

export async function deleteUser(id) {
    await pool.query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);
}

//GRUPOS
export async function getGroups(search = "") {
    const [rows] = await pool.query(
        "SELECT * FROM grupos WHERE nombre_grupo LIKE ? OR carrera LIKE ? OR numero_alumnos LIKE ?",
        [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    console.log(rows);
    return rows;
}

export async function createGroup(nombre_grupo, carrera, numero_alumnos) {
    const estado = 1;
    const [result] = await pool.query(
        "INSERT INTO grupos (nombre_grupo, carrera, numero_alumnos, estado) VALUES (?,?,?,?)",
        [nombre_grupo, carrera, numero_alumnos, estado]
    );
    return result;
}

// export async function getGroup(id) {
//     const [rows] = await pool.query("SELECT * FROM grupos WHERE id= ?", [id]);
//     return rows;
// }

export async function editGroup(
    id,
    nombre_grupo,
    carrera,
    numero_alumnos,
    estado
) {
    await pool.query(
        "UPDATE grupos SET nombre_grupo = ?, carrera = ?, numero_alumnos = ?, estado = ? WHERE id_grupo = ?",
        [nombre_grupo, carrera, numero_alumnos, estado, id]
    );
}

export async function deleteGroup(id) {
    await pool.query("DELETE FROM grupos WHERE id_grupo= ?", [id]);
}


export async function getHorarios() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                h.id_horario,
                h.hora_inicio,
                h.hora_fin,
                h.dia,
                u.nombre_usuario AS profesor,
                g.nombre_grupo AS grupo,
                g.carrera,
                h.estado
            FROM horarios h
            LEFT JOIN usuarios u ON h.id_usuario = u.id_usuario
            LEFT JOIN grupos g ON h.id_grupo = g.id_grupo
            WHERE h.estado = 1
        `);






        return rows;
    } catch (error) {
        console.error("Error al obtener los horarios:", error);
        throw error;
    }
}



export async function getUsuarios() {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM usuarios WHERE estado = 1
        `);

        return rows;
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        throw error;
    }
}



export async function getGrupos() {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM grupos WHERE estado = 1
        `);

        return rows;
    } catch (error) {
        console.error("Error al obtener los grupos:", error);
        throw error;
    }
}
export async function deleteHorario(id_horario) {
    try {
        const [result] = await pool.query(`
            UPDATE horarios 
            SET estado = 0 
            WHERE id_horario = ? AND estado = 1
        `, [id_horario]);

        if (result.affectedRows > 0) {
            return { success: true, message: "Horario eliminado correctamente." };
        } else {
            return { success: false, message: "No se encontró el horario o ya estaba desactivado." };
        }
    } catch (error) {
        console.error("Error al eliminar el horario:", error);
        throw error;
    }
}
export async function upHorario(hora_inicio, hora_fin, dia, id_usuario, id_grupo) {
    try {
        // Verificar si ya existe un horario con la misma hora de inicio y fin en estado activo
        const [existing] = await pool.query(`
            SELECT id_horario FROM horarios 
            WHERE hora_inicio = ? AND hora_fin = ? AND dia = ? 
        `, [hora_inicio, hora_fin, dia]);

        if (existing.length > 0) {
            // Si ya existe, actualizar los datos
            const id_horario = existing[0].id_horario;
            const [updateResult] = await pool.query(`
                UPDATE horarios 
                SET id_usuario = ?, id_grupo = ?
                WHERE id_horario = ?
            `, [id_usuario, id_grupo, id_horario]);

            return { success: true, message: "Horario actualizado correctamente." };
        } else {
            // Si no existe, crear uno nuevo
            const [insertResult] = await pool.query(`
                INSERT INTO horarios (hora_inicio, hora_fin, dia, id_usuario, id_grupo, estado) 
                VALUES (?, ?, ?, ?, ?, 1)
            `, [hora_inicio, hora_fin, dia, id_usuario, id_grupo]);

            return { success: true, message: "Horario creado correctamente.", id_horario: insertResult.insertId };
        }
    } catch (error) {
        console.error("Error al insertar o actualizar el horario:", error);
        throw error;
    } 
}
export async function upSolicitud(hora_inicio, hora_fin, dia, id_solicitante, id_grupo_nuevo, descripcion, estado = "Pendiente") {
    try {
        // Verificar si ya existe una solicitud con la misma hora de inicio y fin en el mismo día
        const [existing] = await pool.query(`
            SELECT id_solicitud FROM solicitudes 
            WHERE hora_inicio = ? AND hora_fin = ? AND dia = ?
        `, [hora_inicio, hora_fin, dia]);

        if (existing.length > 0) {
            // Si ya existe, actualizar los datos
            const id_solicitud = existing[0].id_solicitud;
            const [updateResult] = await pool.query(`
                UPDATE solicitudes 
                SET id_solicitante = ?, id_grupo_nuevo = ?, descripcion = ?, estado = ?
                WHERE id_solicitud = ?
            `, [id_solicitante, id_grupo_nuevo, descripcion, estado, id_solicitud]);

            return { success: true, message: "Solicitud actualizada correctamente." };
        } else {
            // Si no existe, crear una nueva solicitud con estado por defecto "Pendiente"
            const [insertResult] = await pool.query(`
                INSERT INTO solicitudes (hora_inicio, hora_fin, dia, id_solicitante, id_grupo_nuevo, descripcion, estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [hora_inicio, hora_fin, dia, id_solicitante, id_grupo_nuevo, descripcion, estado]);

            return { success: true, message: "Solicitud creada correctamente.", id_solicitud: insertResult.insertId };
        }
    } catch (error) {
        console.error("Error al insertar o actualizar la solicitud:", error);
        throw error;
    }
}


