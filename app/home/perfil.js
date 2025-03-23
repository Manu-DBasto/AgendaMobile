import React, { useContext, useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { DataTable } from "react-native-paper";
import Modal from "react-native-modal";
import { AuthContext } from "../../context/authContext";
import config from "@/components/config";
import { colors } from "@/assets/utilities/colors";

export default function Perfil() {
    const { isAuthenticated, user, setUser } = useContext(AuthContext);
    const [isModalVisible, setModalVisible] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    console.log(user);

    // const fetchUserData = async () => {
    //     try {
    //         const response = await fetch(
    //             `https://tursosv.onrender.com/users/${user.id_usuario}`
    //         );
    //         const data = await response.json();
    //         setUser(data);
    //         setEditedUser(data);
    //     } catch (error) {
    //         console.error("Error al obtener usuario:", error);
    //     }
    // };

    const fetchUserData = async () => {
        if (!user?.id_usuario) return;
        try {
            const response = await fetch(
                `https://tursosv.onrender.com/users/${user.id_usuario}`
            );
            const data = await response.json();
            setUser(data);
            setEditedUser(data);
        } catch (error) {
            console.error("Error al obtener usuario:", error);
        }
    };

    // useEffect(() => {
    //     if (user) fetchUserData();
    // }, []);

    // useEffect(() => {
    //     if (user) setEditedUser({ ...user });
    // }, [user]);

    useEffect(() => {
        fetchUserData();
    }, [user?.id_usuario]);

    // Sincronizar editedUser con user cuando se actualiza
    useEffect(() => {
        if (user) setEditedUser({ ...user });
    }, [user]);

    // const handleEdit = async () => {
    //     if (!editedUser) return;
    //     try {
    //         const response = await fetch(
    //             `https://tursosv.onrender.com/users/${user.id_usuario}`,
    //             {
    //                 method: "PUT",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(editedUser),
    //             }
    //         );
    //         const result = await response.json();
    //         if (result.message === "Usuario actualizado correctamente") {
    //             fetchUserData();
    //             setModalVisible(false);

    //             alert(
    //                 "Perfil actualizado. Para ver los cambios reflejados, es necesario iniciar sesion nuevamente"
    //             );
    //         }
    //     } catch (error) {
    //         console.error("Error actualizando usuario:", error);
    //     }
    // };

    const handleEdit = async () => {
        if (!editedUser) return;
        try {
            const response = await fetch(
                `https://tursosv.onrender.com/users/${user.id_usuario}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editedUser),
                }
            );
            const result = await response.json();

            if (result.message === "Usuario actualizado correctamente") {
                setUser(editedUser);
                setModalVisible(false);
            }
        } catch (error) {
            console.error("Error actualizando usuario:", error);
        }
    };

    if (!isAuthenticated || !user) return <Text>Cargando...</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Información Personal</Text>
            <Text style={styles.instruction}>
                Haga click sobre su informacion para poder editarla.
            </Text>
            <View style={styles.card}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <DataTable style={styles.table}>
                        <DataTable.Row>
                            <DataTable.Cell>
                                <Text style={styles.label}>Nombre:</Text>
                            </DataTable.Cell>
                            <DataTable.Cell>
                                <Text style={styles.dataText}>
                                    {user?.nombre_usuario || "N/A"}
                                </Text>
                            </DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>
                                <Text style={styles.label}>Correo:</Text>
                            </DataTable.Cell>
                            <DataTable.Cell>
                                <Text style={styles.dataText}>
                                    {user?.email || "N/A"}
                                </Text>
                            </DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>
                                <Text style={styles.label}>Teléfono:</Text>
                            </DataTable.Cell>
                            <DataTable.Cell>
                                <Text style={styles.dataText}>
                                    {user?.telefono || "N/A"}
                                </Text>
                            </DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>
                                <Text style={styles.label}>Materia:</Text>
                            </DataTable.Cell>
                            <DataTable.Cell>
                                <Text style={styles.dataText}>
                                    {user?.materia_grupo || "N/A"}
                                </Text>
                            </DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>
                </TouchableOpacity>
            </View>
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
            >
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>Editar Perfil</Text>
                    <TextInput
                        style={styles.input}
                        value={editedUser?.nombre_usuario}
                        onChangeText={(text) =>
                            setEditedUser({
                                ...editedUser,
                                nombre_usuario: text,
                            })
                        }
                        placeholder="Nombre"
                    />
                    <TextInput
                        style={styles.input}
                        value={editedUser?.email}
                        onChangeText={(text) =>
                            setEditedUser({ ...editedUser, email: text })
                        }
                        placeholder="Correo"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        value={editedUser?.telefono}
                        onChangeText={(text) =>
                            setEditedUser({ ...editedUser, telefono: text })
                        }
                        placeholder="Teléfono"
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={styles.input}
                        value={editedUser?.materia_grupo}
                        onChangeText={(text) =>
                            setEditedUser({
                                ...editedUser,
                                materia_grupo: text,
                            })
                        }
                        placeholder="Materia"
                        keyboardType="phone-pad"
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleEdit}
                        >
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    instruction: {
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 15,
        textAlign: "center",
        color: colors.secondary,
    },
    container: { flex: 1, padding: 20, backgroundColor: colors.background },
    headerTitle: {
        fontSize: 34,
        fontWeight: "bold",
        color: colors.primary,
        textAlign: "center",
        marginBottom: 20,
    },
    card: {
        backgroundColor: colors.light,
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        elevation: 3,
    },
    label: { fontWeight: "bold", color: colors.dark, fontSize: 15 },
    table: { backgroundColor: "white", borderRadius: 10, fontSize: 28 },
    modal: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        color: colors.primary,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        borderColor: colors.secondary,
        backgroundColor: "#f9f9f9",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
    },
    saveButton: { backgroundColor: colors.success },
    cancelButton: { backgroundColor: colors.error },
    buttonText: { color: "white", fontWeight: "bold" },
    dataText: { fontSize: 20, color: colors.dark },
});
