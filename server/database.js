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
