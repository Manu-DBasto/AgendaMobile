// Login.js
import React, { useContext, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform,
} from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import config from "@/components/config";
import tursoConfig from "@/components/tursoConfig";
import { AuthContext } from "@/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "@/assets/utilities/colors";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    useEffect(() => {
        const checkSession = async () => {
            const userSession = await AsyncStorage.getItem("userSession");
            console.log(userSession);
            if (userSession) {
                router.replace("/home/home");
            }
        };
        checkSession();
    }, []);

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
                login(data.user);
                router.push("home/home");
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("No se pudo conectar al servidor.");
        }
    };

    const tursoHandleLogin = async () => {
        if (!email || !password) {
            alert("LLene los campos antes de enviar el formulario.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Introduzca un correo electronico valido.");
            return;
        }
        try {
            const response = await fetch(`https://tursosv.onrender.com/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user);
                router.push("home/uhorario");
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("No se pudo conectar al servidor.");
        }
    };

    return (
        <View style={styles.body}>
            <View style={styles.wrapper}>
                <Text style={styles.title}>Log in</Text>

                <View style={styles.form}>
                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Correo electrónico</Text>
                        <TextInput
                            keyboardType="email-address"
                            placeholder="julian@mail.com"
                            onChangeText={setEmail}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            placeholder="julian1234"
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    <View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={tursoHandleLogin}
                        >
                            <Text style={styles.textButton}>
                                Iniciar sesión
                            </Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.greenBackground,
    },

    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
        backgroundColor: colors.light,
        padding: 50,
        borderRadius: 40,
    },

    title: {
        fontSize: 30,
        color: colors.primary,
        fontWeight: "700",
    },

    input: {
        width: 250,
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 10,
        padding: 10,
        color: colors.dark,
        backgroundColor: colors.light,
    },

    form: {
        gap: 20,
    },

    label: {
        fontWeight: "600",
        color: colors.secondary,
    },

    button: {
        backgroundColor: colors.accent,
        borderRadius: 10,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },

    textButton: {
        color: colors.light,
        fontWeight: "600",
        fontSize: 15,
    },

    link: {
        color: colors.accent,
        fontWeight: "500",
    },

    ...(Platform.OS === "web"
        ? {
              body: {
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.greenBackground,
              },

              wrapper: {
                  backgroundColor: colors.background,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 50,
                  padding: 50,
                  borderRadius: 40,
              },
          }
        : {
              body: {
                  backgroundColor: colors.background,
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
              },

              wrapper: {
                  backgroundColor: colors.background,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 50,
              },
          }),
});
