import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { NetworkInfo } from "react-native-network-info";

export default function Login() {
    const [name, setName] = useState("");
    const [rol, setRol] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [ip, setIp] = useState("");

    //PEGUEN AQUI SI IP:
    const MyIpAddress = "192.168.1.72";

    useEffect(() => {
        if (Platform.OS !== "web") {
            setIp();
        } else {
            setIp(`localhost`);
        }
    }, []);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleRegister = async () => {
        // const formattedName = name.trim();
        // const formattedEmail = email.trim();
        // const formattedPassword = password.trim();
        // const formattedRepeatPassword = repeatPassword.trim();

        if (!email || !name || !password || !repeatPassword) {
            alert("Llene los campos antes de enviar el formulario.");
            // Alert.alert(
            //     "Error",
            //     "Llene los campos antes de enviar el formulario."
            // );
            return;
        }

        if (!validateEmail(email)) {
            alert("Introduzca un correo electrónico válido.");
            // Alert.alert("Error", "Introduzca un correo electrónico válido");
            return;
        }

        if (password === repeatPassword) {
            try {
                const response = await fetch(`http://${ip}:8080/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                });
                const data = await response.json();

                if (response.ok) {
                    // Inicio de sesión exitoso
                    router.push("/"); // Redirige a la pantalla /home
                } else {
                    // Error en el inicio de sesión
                    alert(data.message);
                    // Alert.alert("Error", data.message || "Registro fallido");
                }
            } catch (error) {
                alert(data.message);
                // Alert.alert("Error", error.message);
            }
        } else {
            alert("Las contraseñas no coinciden.");
            // Alert.alert("Error", "Las contraseñas no coinciden");
        }
    };
    return (
        <View style={styles.body}>
            <Text style={styles.title}>Registrese</Text>

            <View style={styles.form}>
                <View style={{ gap: 5 }}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        placeholder="Julian Ortega"
                        style={styles.input}
                        onChangeText={setName}
                    />
                </View>

                <View style={{ gap: 5 }}>
                    <Text style={styles.label}>Materia</Text>
                    <TextInput placeholder="Inglés" style={styles.input} />
                </View>

                <View style={{ gap: 5 }}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput
                        keyboardType="email-address"
                        placeholder="julian@mail.com"
                        style={styles.input}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={{ gap: 5 }}>
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        placeholder="julian1234"
                        secureTextEntry
                        style={styles.input}
                        onChangeText={setPassword}
                    />
                </View>
                <View style={{ gap: 5 }}>
                    <Text style={styles.label}>Confirmar contraseña</Text>
                    <TextInput
                        placeholder="julian1234"
                        secureTextEntry
                        style={styles.input}
                        onChangeText={setRepeatPassword}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                    >
                        <Text style={styles.textButton}>Registrarse</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text>
                Ya tiene cuenta?{" "}
                <Link href={{ pathname: "/" }} style={styles.link}>
                    Inicie sesión
                </Link>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
    },

    title: {
        fontSize: 30,
        color: "#690087",
        fontWeight: 700,
    },

    input: {
        width: 250,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        padding: 10,
        color: "#3b3b3b",
    },

    form: {
        gap: 20,
    },

    label: {
        fontWeight: 600,
        color: "#690087",
    },

    button: {
        backgroundColor: "#690087",
        borderRadius: 10,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },

    textButton: {
        color: "#fff",
        fontWeight: 600,
        fontSize: 15,
    },

    link: {
        color: "#690087",
        fontWeight: 500,
    },
});
