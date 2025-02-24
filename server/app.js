import express from "express";
import { login, registerUser, getHorarios, getUsuarios, getGrupos, deleteHorario } from "./database.js";
import cors from "cors";

const app = express();
app.use(express.json());

const corsOptions = {
    methods: ["POST", "GET"],
};

app.use(cors(corsOptions));

// Ruta para el registro de usuarios
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

// Ruta para el inicio de sesión
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


app.post("/horario", async (req, res) => {
    try {
        const horario = await getHorarios();
        res.status(200).json({ message: "Horarios obtenidos correctamente", horario });
    } catch (error) {
        console.error("Error al obtener los horarios:", error);
        res.status(401).json({
            message: error.message,
            error: error.message,
        });
    }
});

app.post("/usuarios", async (req, res) => {
    try {
        const usuarios = await getUsuarios();
        res.status(200).json({ message: "Usuarios obtenidos correctamente", usuarios });
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(401).json({
            message: error.message,
            error: error.message,
        });
    }
});


app.post("/grupos", async (req, res) => {
    try {
        const grupos = await getGrupos();
        res.status(200).json({ message: "Grupos obtenidos correctamente", grupos });
    } catch (error) {
        console.error("Error al obtener los grupos:", error);
        res.status(401).json({
            message: error.message,
            error: error.message,
        });
    }
});
app.post("/delete-horario", async (req, res) => {
    try {
        const { id_horario } = req.body;

        if (!id_horario) {
            return res.status(400).json({ message: "El id_horario es obligatorio." });
        }

        const result = await deleteHorario(id_horario);

        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(404).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el horario.",
            error: error.message,
        });
    }
});



app.listen(8080, () => {
    console.log("Server running on port 8080");
});
