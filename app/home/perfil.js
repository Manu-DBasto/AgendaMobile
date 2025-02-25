import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import Modal from "react-native-modal";
import { AuthContext } from "../../context/authContext";
import config from "@/components/config";
import { colors } from "@/assets/utilities/colors"; // Asegurar que está definido

export default function Perfil() {
    const { isAuthenticated, user, setUser } = useContext(AuthContext);
    const [isModalVisible, setModalVisible] = useState(false);
    const [editedUser, setEditedUser] = useState(null);

    // Función para obtener los datos del usuario desde la API
    const fetchUserData = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/users/${user.id_usuario}`);
            const data = await response.json();
            setUser(data); // Actualiza el estado global del usuario
            setEditedUser(data); // También actualiza los datos en el modal
        } catch (error) {
            console.error("Error al obtener usuario:", error);
        }
    };

    // Cargar datos al abrir la pantalla
    useEffect(() => {
        if (user) {
            fetchUserData(); // Obtiene los datos actualizados desde la BD
        }
    }, []);

    // Actualizar `editedUser` cada vez que cambie `user`
    useEffect(() => {
        if (user) {
            setEditedUser({ ...user });
        }
    }, [user]);

    // Función para actualizar usuario en la base de datos
    const handleEdit = async () => {
        if (!editedUser) return;

        console.log("Datos enviados a la API:", editedUser);

        try {
            const response = await fetch(`${config.serverUrl}/users/${user.id_usuario}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedUser),
            });

            const result = await response.json();
            console.log("Respuesta de la API:", result);

            if (result.message === "Usuario actualizado correctamente") {
                fetchUserData(); // Recargar los datos desde la API
                setModalVisible(false); // Cerrar el modal
            } else {
                console.error("Error al actualizar:", result.error);
            }
        } catch (error) {
            console.error("Error actualizando usuario:", error);
        }
    };

    if (!isAuthenticated || !user) return <Text>Cargando...</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil de Usuario</Text>
            <DataTable style={styles.tableContainer}>
                <DataTable.Header>
                    <DataTable.Title>Nombre</DataTable.Title>
                    <DataTable.Title>Email</DataTable.Title>
                    <DataTable.Title>Teléfono</DataTable.Title>
                </DataTable.Header>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <DataTable.Row style={styles.tableRowfirst}>
                        <DataTable.Cell style={styles.dataText}>{user?.nombre_usuario || "N/A"}</DataTable.Cell>
                        <DataTable.Cell style={styles.dataText}>{user?.email || "N/A"}</DataTable.Cell>
                        <DataTable.Cell style={styles.dataText}>{user?.telefono || "N/A"}</DataTable.Cell>
                    </DataTable.Row>
                </TouchableOpacity>
            </DataTable>

            {/* Modal para edición */}
            <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.modalContainer}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Editar Perfil</Text>
                    <TextInput
                        style={styles.input}
                        value={editedUser?.nombre_usuario || ""}
                        onChangeText={(text) => setEditedUser({ ...editedUser, nombre_usuario: text })}
                        placeholder="Nombre"
                    />
                    <TextInput
                        style={styles.input}
                        value={editedUser?.email || ""}
                        onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
                        placeholder="Correo"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        value={editedUser?.telefono || ""}
                        onChangeText={(text) => setEditedUser({ ...editedUser, telefono: text })}
                        placeholder="Teléfono"
                        keyboardType="phone-pad"
                    />
                    <TouchableOpacity style={[styles.button, styles.save]} onPress={handleEdit}>
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => setModalVisible(false)}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
        alignItems: "center",
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
        color: colors.primary,
    },

    instruction: {
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 15,
        textAlign: "center",
        color: colors.secondary,
    },

    tableContainer: {
        backgroundColor: colors.light,
        padding: 20,
        borderRadius: 20,
        maxWidth: 700,
    },

    tableRowfirst: {
        borderColor: colors.accent,
        backgroundColor: colors.light,
    },
    tableRowsecond: {
        borderColor: colors.accent,
        backgroundColor: colors.background,
    },

    dataText: { color: colors.onAccent },

    //Estilos del modal
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: colors.greenBackground,
        padding: 20,
        borderRadius: 10,
        gap: 10,
        maxWidth: 700,
        width: "100%",
    },

    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: colors.secondary,
        color: colors.onAccent,
        backgroundColor: colors.light,
    },

    pickerContainer: {
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 10,
        overflow: "hidden",
    },

    picker: {
        width: "100%",
        minHeight: 40,
        backgroundColor: colors.light,
    },

    label: {
        fontWeight: "600",
        color: colors.secondary,
    },

    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },

    button: { padding: 10, borderRadius: 5 },

    save: {
        backgroundColor: colors.success,
    },

    delete: {
        backgroundColor: colors.error,
    },

    cancel: {
        backgroundColor: colors.dark,
    },

    buttonText: {
        color: colors.light,
        fontWeight: "bold",
    },
});
