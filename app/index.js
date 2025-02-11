import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import config from "@/components/config";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            alert("LLene los campos antes de enviar el formulario.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Introduzca un correo electronico valido.");
            return;
        }
        try {
            const response = await fetch(`${config.serverUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push("/home");
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("No se pudo conectar al servidor.");
        }
    };

    return (
        <View style={styles.body}>
            <Text style={styles.title}>Log in</Text>

            <View style={styles.form}>
                <View style={{ gap: 5 }}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput
                        keyboardType="email-address"
                        placeholder="julien@mail.com"
                        onChangeText={setEmail}
                        style={styles.input}
                    />
                </View>

                <View style={{ gap: 5 }}>
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        placeholder="julian1234"
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />
                </View>

                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                    >
                        <Text style={styles.textButton}>Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text>
                No tiene cuenta?{" "}
                <Link href={{ pathname: "/register" }} style={styles.link}>
                    Registrese
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
