import express from "express";
import { login, registerUser } from "./database.js";
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

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
