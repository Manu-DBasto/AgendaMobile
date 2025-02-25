import express from "express";
import {
    registerUser,
    login,
    getUsers,
    updateUser,
    deleteUser,
} from "./database.js";
import cors from "cors";
import "dotenv/config"; // Para cargar las variables de entorno

const app = express();
app.use(express.json());

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

// Registra un nuevo usuario
app.post("/register", async (req, res) => {
    try {
        const { nombre_usuario, email, contraseña, telefono, materia_grupo } =
            req.body;
        const user = await registerUser(
            nombre_usuario,
            email,
            contraseña,
            telefono,
            materia_grupo
        );
        res.status(201).json({
            message: "Usuario registrado exitosamente",
            user,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

// Inicia sesión
app.post("/login", async (req, res) => {
    try {
        const { email, contraseña } = req.body;
        const user = await login(email, contraseña);
        res.status(200).json({ message: "Inicio de sesión exitoso", user });
    } catch (error) {
        res.status(401).json({
            message: error.message,
        });
    }
});

// Obtiene todos los usuarios
app.get("/users", async (req, res) => {
    try {
        const search = req.query.search || "";
        const users = await getUsers(search);
        res.status(200).send(users);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo usuarios" });
    }
});

// Actualiza un usuario
app.put("/users/:id", async (req, res) => {
    const { id } = req.params; // Obteniendo el id desde la URL
    try {
        const { nombre_usuario, email, telefono, materia_grupo } = req.body;
        await updateUser(id, nombre_usuario, email, telefono, materia_grupo);
        res.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error actualizando usuario" });
    }
});

// Elimina un usuario
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params; // Obteniendo el id desde la URL
    try {
        await deleteUser(id);
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando usuario" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor ya esta jalando en el puerto ${PORT}`);
});
