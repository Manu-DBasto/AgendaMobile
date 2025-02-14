import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import Modal from "react-native-modal";
import { DataTable } from "react-native-paper";
import config from "@/components/config";
import { Picker } from "@react-native-picker/picker";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/users`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            alert(error);
        }
    };

    const handleEdit = async () => {
        if (!selectedUser) return;
        console.log(selectedUser);
        try {
            await fetch(`${config.serverUrl}/users/${selectedUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedUser),
            });
            fetchUsers();
            setModalVisible(false);
        } catch (error) {
            console.error("Error updating user:", error);
            alert(error);
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            await fetch(`${config.serverUrl}/users/${selectedUser.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedUser),
            });
            fetchUsers();
            setModalVisible(false);
        } catch (error) {
            console.error("Error deleting user:", error);
            alert(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestión de Usuarios</Text>
            <Text style={styles.instruction}>
                Toque sobre uno de los usuarios.
            </Text>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Nombre</DataTable.Title>
                    <DataTable.Title>Email</DataTable.Title>
                    <DataTable.Title>Teléfono</DataTable.Title>
                </DataTable.Header>
                <FlatList
                    data={users}
                    keyExtractor={(users) => users.id_usuario}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedUser(item);
                                setModalVisible(true);
                            }}
                        >
                            <DataTable.Row>
                                <DataTable.Cell>
                                    {item.nombre_usuario}
                                </DataTable.Cell>
                                <DataTable.Cell>{item.email}</DataTable.Cell>
                                <DataTable.Cell>{item.telefono}</DataTable.Cell>
                            </DataTable.Row>
                        </TouchableOpacity>
                    )}
                />
            </DataTable>

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
            >
                <View style={styles.modal}>
                    <Text style={styles.title}>Usuario</Text>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Nombre</Text>
                        <TextInput
                            style={styles.input}
                            value={selectedUser?.nombre_usuario}
                            onChangeText={(text) =>
                                setSelectedUser({
                                    ...selectedUser,
                                    nombre_usuario: text,
                                })
                            }
                            placeholder="Nombre"
                        />
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            value={selectedUser?.email}
                            onChangeText={(text) =>
                                setSelectedUser({
                                    ...selectedUser,
                                    email: text,
                                })
                            }
                            placeholder="Correo"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Teléfono</Text>
                        <TextInput
                            style={styles.input}
                            value={selectedUser?.telefono}
                            onChangeText={(text) =>
                                setSelectedUser({
                                    ...selectedUser,
                                    telefono: text,
                                })
                            }
                            placeholder="Teléfono"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Materia</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedUser?.materia_grupo}
                                onValueChange={(itemValue) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        materia_grupo: itemValue,
                                    })
                                }
                                style={styles.picker}
                            >
                                <Picker.Item label="Inglés" value="ingles" />
                                <Picker.Item label="Francés" value="frances" />
                                <Picker.Item label="Otros" value="otros" />
                            </Picker>
                        </View>
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Maestro activo?</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedUser?.estado}
                                onValueChange={(itemValue) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        estado: itemValue,
                                    })
                                }
                                style={styles.picker}
                            >
                                <Picker.Item label="Si" value={1} />
                                <Picker.Item label="No" value={0} />
                            </Picker>
                        </View>
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Permisos</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedUser?.rol}
                                onValueChange={(itemValue) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        rol: itemValue,
                                    })
                                }
                                style={styles.picker}
                            >
                                <Picker.Item label="Maestro" value="maestro" />
                                <Picker.Item
                                    label="Administrador"
                                    value="admin"
                                />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.delete]}
                            onPress={handleDelete}
                        >
                            <Text style={styles.buttonText}>Eliminar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.cancel]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Salir</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.save]}
                            onPress={handleEdit}
                        >
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
        color: "#9146FF",
    },

    instruction: {
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 15,
        textAlign: "center",
        color: "gray",
    },

    modal: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        gap: 10,
    },

    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: "gray",
        color: "#3b3b3b",
        backgroundColor: "#f4edff",
    },

    pickerContainer: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        overflow: "hidden",
    },

    picker: {
        width: "100%",
        minHeight: 40,
        backgroundColor: "#f4edff",
    },
    label: {
        fontWeight: "600",
        color: "#9146FF",
    },

    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },

    button: { padding: 10, borderRadius: 5 },

    save: {
        backgroundColor: "#28a745",
    },

    delete: {
        backgroundColor: "#dc3545",
    },

    cancel: {
        backgroundColor: "#6c757d",
    },

    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});
