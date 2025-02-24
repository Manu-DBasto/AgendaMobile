import express from "express";
import {
    login,
    registerUser,
    getUsers,
    deleteUser,
    updateUser,
    getGroups,
    createGroup,
    editGroup,
    deleteGroup,

    getHorarios, getUsuarios, getGrupos, deleteHorario
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
        const search = req.query.search || "";
        const users = await getUsers(search);
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

//GRUPOS
app.get("/groups", async (req, res) => {
    try {
        const search = req.query.search || "";
        const groups = await getGroups(search);

        res.status(200).send(groups);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo los grupos" });
    }
});

app.post("/createGroup", async (req, res) => {
    try {
        const { nombre_grupo, carrera, numero_alumnos } = req.body;
        const group = await createGroup(nombre_grupo, carrera, numero_alumnos);
        res.status(201).json({
            message: "Grupo creado exitosamente",
            group,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
            error: error.message,
        });
    }
});

app.put("/groups/:id", async (req, res) => {
    try {
        const { id_grupo, nombre_grupo, carrera, numero_alumnos, estado } =
            req.body;
        await editGroup(
            id_grupo,
            nombre_grupo,
            carrera,
            numero_alumnos,
            estado
        );
        res.status(200).json({ message: "Grupo actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error actualizando grupo" });
    }
});

app.delete("/groups/:id", async (req, res) => {
    try {
        const { id_grupo } = req.body;
        await deleteGroup(id_grupo);
        res.status(200).json({ message: "Grupo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando grupo" });
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
    console.log("El server ya arrancó en el puerto 8080");
});
