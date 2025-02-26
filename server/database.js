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

export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    return rows;
}

export async function getUser(id) {
    const [rows]= await pool.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id]);

    return rows[0];
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
