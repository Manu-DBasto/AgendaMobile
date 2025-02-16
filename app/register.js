import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { Picker } from "@react-native-picker/picker"; // Asegúrate de instalarlo
import config from "@/components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [subject, setSubject] = useState("ingles");

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    useEffect(() => {
        const checkSession = async () => {
            const userSession = await AsyncStorage.getItem("userSession");
            if (userSession) {
                router.replace("/home/home");
            }
        };
        checkSession();
    }, []);

    const handleRegister = async () => {
        if (!email || !name || !password || !repeatPassword) {
            alert("Llene los campos antes de enviar el formulario.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Introduzca un correo electrónico válido.");
            return;
        }

        if (password === repeatPassword) {
            try {
                const response = await fetch(`${config.serverUrl}/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        phone,
                        subject,
                    }),
                });
                const data = await response.json();

                if (response.ok) {
                    router.push("/");
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert("Error al registrar.");
            }
        } else {
            alert("Las contraseñas no coinciden.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            style={styles.body}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Regístrese</Text>

                <View style={styles.form}>
                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Nombre</Text>
                        <TextInput
                            placeholder="Julian Ortega"
                            style={styles.input}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Materia</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={subject}
                                onValueChange={(itemValue) =>
                                    setSubject(itemValue)
                                }
                                style={styles.picker}
                            >
                                <Picker.Item label="Inglés" value="Inglés" />
                                <Picker.Item label="Francés" value="Francés" />
                                <Picker.Item label="Otros" value="Otros" />
                            </Picker>
                        </View>
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Correo electrónico</Text>
                        <TextInput
                            keyboardType="email-address"
                            placeholder="julian@mail.com"
                            style={styles.input}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Número telefónico</Text>
                        <TextInput
                            keyboardType="phone-pad"
                            placeholder="9990009999"
                            style={styles.input}
                            onChangeText={setPhone}
                        />
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            placeholder="julian1234"
                            secureTextEntry
                            style={styles.input}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Confirmar contraseña</Text>
                        <TextInput
                            placeholder="julian1234"
                            secureTextEntry
                            style={styles.input}
                            onChangeText={setRepeatPassword}
                            autoCapitalize="none"
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
                    ¿Ya tiene cuenta?{" "}
                    <Link href={{ pathname: "/" }} style={styles.link}>
                        Inicie sesión
                    </Link>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#fff",
    },

    scrollView: {
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
        paddingVertical: 20,
    },
    ...(Platform.OS === "web"
        ? {
              body: {
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 30,
              },

              scrollView: {
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 50,
                  paddingBottom: 20,
                  paddingTop: 20,
                  paddingLeft: 50,
                  paddingRight: 50,
                  borderRadius: 40,
              },
          }
        : {}),

    title: {
        fontSize: 30,
        color: "#9146FF",
        fontWeight: "700",
    },

    input: {
        width: 250,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        padding: 10,
        color: "#3b3b3b",
    },

    pickerContainer: {
        width: 250,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        overflow: "hidden",
    },

    picker: {
        width: "100%",
        minHeight: 40,
    },

    form: {
        gap: 20,
    },

    label: {
        fontWeight: "600",
        color: "#9146FF",
    },

    button: {
        backgroundColor: "#9146FF",
        borderRadius: 10,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },

    textButton: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
    },

    link: {
        color: "#9146FF",
        fontWeight: "500",
    },
});
