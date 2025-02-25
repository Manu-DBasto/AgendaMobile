import { createClient } from "@libsql/client";
import "dotenv/config";

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// Función para registrar un nuevo usuario
export async function registerUser(
    nombre_usuario,
    email,
    contraseña,
    telefono,
    materia_grupo
) {
    // Verifica si el correo electrónico ya está registrado
    const existingUser = await turso.execute(
        `SELECT * FROM usuarios WHERE email = ?`,
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Correo electrónico ya está registrado");
    }

    // Si no existe, procede con el registro
    const result = await turso.execute(
        `INSERT INTO usuarios (nombre_usuario, email, contraseña, telefono, materia_grupo) VALUES (?, ?, ?, ?, ?)`,
        [nombre_usuario, email, contraseña, telefono, materia_grupo]
    );

    return result;
}

// Función para iniciar sesión
export async function login(email, contraseña) {
    const [row] = await turso.execute(
        `SELECT * FROM usuarios WHERE email = ?`,
        [email]
    );

    if (row.length > 0 && row[0].contraseña === contraseña) {
        // XXX: Asegúrate de hash la contraseña.
        return row[0];
    } else {
        throw new Error("Usuario no encontrado o contraseña incorrecta");
    }
}

// Función para obtener todos los usuarios
export async function getUsers(search = "") {
    const result = await turso.execute(
        `SELECT * FROM usuarios WHERE nombre_usuario LIKE ? OR email LIKE ?`,
        [`%${search}%`, `%${search}%`]
    );
    const users = result.rows;
    console.log(users);
    return users;
}

// Función para actualizar un usuario
export async function updateUser(
    id,
    nombre_usuario,
    email,
    telefono,
    materia_grupo
) {
    await turso.execute(
        `UPDATE usuarios SET nombre_usuario = ?, email = ?, telefono = ?, materia_grupo = ? WHERE id_usuario = ?`,
        [nombre_usuario, email, telefono, materia_grupo, id]
    );
}

// Función para eliminar un usuario
export async function deleteUser(id) {
    await turso.execute(`DELETE FROM usuarios WHERE id_usuario = ?`, [id]);
}
