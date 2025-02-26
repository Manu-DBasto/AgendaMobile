import express from "express";
import {
    login,
    registerUser,
    getUsers,
    getUser,
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

app.get("/user/:id", async (req, res) => {
    try {
        const { id_usuario } = req.body;
        const user = await getUser(id_usuario);

        res.status(200).send(user);
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


app.get("/perfil/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const query = "SELECT id_usuario, nombre_usuario, email, telefono FROM usuarios WHERE id_usuario = ?";
        const [rows] = await database.query(query, [id]);

        if (rows.length > 0) {
            res.json(rows[0]); // Devuelve el primer usuario encontrado
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error obteniendo usuario:", error);
        res.status(500).json({ error: "Error al obtener usuario" });
    }
});

// Actualizar datos del usuario
app.put("/perfil/:id", async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body); // 👀 Ver qué llega

    try {
        const { nombre_usuario, email, telefono, contraseña } = req.body;
        const { id } = req.params;

        if (!nombre_usuario || !email || !telefono) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }

        const result = await database.query(
            "UPDATE usuarios SET nombre_usuario = ?, email = ?, telefono = ?, contraseña = ? WHERE id_usuario = ?",
            [nombre_usuario, email, telefono, contraseña, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error("⚠️ Error en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});




app.listen(8080, () => {
    console.log("Server running on port 8080");
});
