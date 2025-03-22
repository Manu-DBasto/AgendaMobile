import { useState, useEffect, useContext } from "react";
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
import tursoConfig from "@/components/tursoConfig";
import { Picker } from "@react-native-picker/picker";
import { colors } from "@/assets/utilities/colors";
import { AuthContext } from "@/context/authContext";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        tursoFetchUsers(search);
    }, [search]);

    //OBTENER USUARIOS EN BASE DE DATOS NORMAL - TURSO
    const fetchUsers = async (search = "") => {
        try {
            const response = await fetch(
                `${config.serverUrl}/users?search=${search}`
            );
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            alert(error);
        }
    };

    const tursoFetchUsers = async (search = "") => {
        try {
            const response = await fetch(
                `https://tursosv.onrender.com/users?search=${search}`
            );
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            alert(error);
        }
    };

    //EDITAR USUARIOS EN BASE DE DATOS NORMAL - TURSO
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

    const tursoHandleEdit = async () => {
        if (!selectedUser) return;
        try {
            await fetch(
                `https://tursosv.onrender.com/users/${selectedUser.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(selectedUser),
                }
            );
            tursoFetchUsers();
            setModalVisible(false);
        } catch (error) {
            console.error("Error updating user:", error);
            alert(error);
        }
    };

    //ELIMINAR USUARIOS EN BASE DE DATOS NORMAL - TURSO
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

    const tursoHandleDelete = async () => {
        if (!selectedUser) return;
        try {
            await fetch(
                `https://tursosv.onrender.com/users/${selectedUser.id}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(selectedUser),
                }
            );
            tursoFetchUsers();
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
                Toque o haga clic en un registro para editar.
            </Text>

            <DataTable style={styles.tableContainer}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.inputSearch}
                        placeholder="Buscar..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <DataTable.Header>
                    <DataTable.Title>Nombre</DataTable.Title>
                    <DataTable.Title>Email</DataTable.Title>
                    <DataTable.Title>Teléfono</DataTable.Title>
                </DataTable.Header>
                <FlatList
                    data={users}
                    keyExtractor={(users) => users.id_usuario}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedUser(item);
                                setModalVisible(true);
                            }}
                        >
                            <DataTable.Row
                                style={[
                                    styles.row,
                                    index % 2 === 0
                                        ? styles.tableRowfirst
                                        : styles.tableRowsecond,
                                ]}
                            >
                                <DataTable.Cell style={styles.dataText}>
                                    {item.nombre_usuario}
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.dataText}>
                                    {item.email}
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.dataText}>
                                    {item.telefono}
                                </DataTable.Cell>
                            </DataTable.Row>
                        </TouchableOpacity>
                    )}
                />
            </DataTable>

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                style={styles.modalContainer}
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
                            onPress={tursoHandleDelete}
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
                            onPress={tursoHandleEdit}
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
        backgroundColor: "#e8f3f5",
    },

    searchContainer: {
        padding: 10,
        width: "100%",
        alignItems: "flex-end",
    },

    inputSearch: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 10,
        width: 200,
        borderColor: colors.secondary,
        color: colors.onAccent,
        backgroundColor: colors.light,
    },

    tableTitle: {
        color: colors.dark,
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
