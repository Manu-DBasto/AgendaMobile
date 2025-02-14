import express from "express";
import {
    login,
    registerUser,
    getUsers,
    deleteUser,
    updateUser,
} from "./database.js";
import cors from "cors";

const app = express();
app.use(express.json());

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

// LOGIN Y REGISTRO
app.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone, subject } = req.body;
        const user = await registerUser(name, email, password, phone, subject);
        res.status(201).json({
            message: "Usuario registrado exitosamente",
            user,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
            error: error.message,
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await login(email, password);
        res.status(200).json({ message: "Inicio de sesión exitoso", user });
    } catch (error) {
        res.status(401).json({
            message: error.message,
            error: error.message,
        });
    }
});

//USUARIOS
app.get("/users", async (req, res) => {
    try {
        const users = await getUsers();

        res.status(200).send(users);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo usuarios" });
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const {
            id_usuario,
            nombre_usuario,
            email,
            telefono,
            materia_grupo,
            rol,
            estado,
        } = req.body;
        await updateUser(
            id_usuario,
            nombre_usuario,
            email,
            telefono,
            materia_grupo,
            rol,
            estado
        );
        res.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error actualizando usuario" });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const { id_usuario } = req.body;
        await deleteUser(id_usuario);
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando usuario" });
    }
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
