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



