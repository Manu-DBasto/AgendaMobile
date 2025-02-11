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
    const [row] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
        email,
    ]);
    if (row.length > 0) {
        const user = row[0];
        const match = await bcrypt.compare(password, user.password);
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

export async function registerUser(name, email, password) {
    // Verifica si el correo electrónico ya está registrado
    const [existingUser] = await pool.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );

    if (existingUser.length > 0) {
        throw new Error("Correo electrónico ya está registrado");
    }
    // Si no existe, procede con el registro
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [name, email, hashedPassword]
    );
    return result;
}
