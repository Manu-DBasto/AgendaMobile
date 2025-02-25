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
import { colors } from "@/assets/utilities/colors";

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        tursoFetchGroups(search);
    }, [search]);

    // OBTENER GRUPOS
    const fetchGroups = async () => {
        try {
            const response = await fetch(
                `${config.serverUrl}/groups?search=${search}`
            );
            const data = await response.json();
            setGroups(data);
        } catch (error) {
            console.error("Error fetching groups:", error);
            alert(error);
        }
    };

    const tursoFetchGroups = async () => {
        try {
            const response = await fetch(
                `https://tursosv.onrender.com/groups?search=${search}`
            );
            const data = await response.json();
            setGroups(data);
        } catch (error) {
            console.error("Error fetching groups:", error);
            alert(error);
        }
    };
    //EDITAR GRUPOS
    const handleEdit = async () => {
        if (!selectedGroup) return;
        console.log(selectedGroup);
        try {
            await fetch(`${config.serverUrl}/groups/${selectedGroup.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedGroup),
            });
            fetchGroups();
            setModalVisible(false);
        } catch (error) {
            console.error("Error updating group:", error);
            alert(error);
        }
    };

    const tursoHandleEdit = async () => {
        if (!selectedGroup) return;
        console.log(selectedGroup);
        try {
            await fetch(
                `https://tursosv.onrender.com/groups/${selectedGroup.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(selectedGroup),
                }
            );
            fetchGroups();
            setModalVisible(false);
        } catch (error) {
            console.error("Error updating group:", error);
            alert(error);
        }
    };

    //ELIMINAR GRUPOS
    const handleDelete = async () => {
        if (!selectedGroup) return;
        try {
            await fetch(`${config.serverUrl}/groups/${selectedGroup.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedGroup),
            });
            fetchGroups();
            setModalVisible(false);
        } catch (error) {
            console.error("Error deleting group:", error);
            alert(error);
        }
    };

    const tursoHandleDelete = async () => {
        if (!selectedGroup) return;
        try {
            await fetch(
                `https://tursosv.onrender.com/groups/${selectedGroup.id}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(selectedGroup),
                }
            );
            fetchGroups();
            setModalVisible(false);
        } catch (error) {
            console.error("Error deleting group:", error);
            alert(error);
        }
    };

    //AGREGAR GRUPOS
    const addGroup = async () => {
        if (!selectedGroup) return;
        try {
            await fetch(`${config.serverUrl}/createGroup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedGroup),
            });
            fetchGroups(); // Recargar la lista de grupos
            setModalVisible(false);
        } catch (error) {
            console.error("Error adding group:", error);
            alert(error);
        }
    };

    const tursoAddGroup = async () => {
        if (!selectedGroup) return;
        try {
            await fetch(`https://tursosv.onrender.com/createGroup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedGroup),
            });
            fetchGroups(); // Recargar la lista de grupos
            setModalVisible(false);
        } catch (error) {
            console.error("Error adding group:", error);
            alert(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestión de Grupos</Text>
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
                <TouchableOpacity
                    onPress={() => {
                        setSelectedGroup(null);
                        setModalVisible(true);
                        console.log(selectedGroup);
                    }}
                    style={styles.addButton}
                >
                    <Text style={styles.buttonText}>Agregar grupo</Text>
                </TouchableOpacity>
                <DataTable.Header>
                    <DataTable.Title>Carreras</DataTable.Title>
                    <DataTable.Title>Grado y grupo</DataTable.Title>
                    <DataTable.Title>Alumnos</DataTable.Title>
                </DataTable.Header>
                <FlatList
                    data={groups}
                    keyExtractor={(groups) => groups.grupo}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedGroup(item);
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
                                    {item.carrera}
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.dataText}>
                                    {item.nombre_grupo}
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.dataText}>
                                    {item.numero_alumnos}
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
                    <Text style={styles.title}>Grupo</Text>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Grado y grupo</Text>
                        <TextInput
                            style={styles.input}
                            value={selectedGroup?.nombre_grupo}
                            onChangeText={(text) =>
                                setSelectedGroup({
                                    ...selectedGroup,
                                    nombre_grupo: text,
                                })
                            }
                            placeholder="8A"
                        />
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Carrera</Text>
                        <TextInput
                            style={styles.input}
                            value={selectedGroup?.carrera}
                            onChangeText={(text) =>
                                setSelectedGroup({
                                    ...selectedGroup,
                                    carrera: text,
                                })
                            }
                            placeholder="Contaduria"
                        />
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Numero de alumnos</Text>
                        <TextInput
                            style={styles.input}
                            value={selectedGroup?.numero_alumnos}
                            onChangeText={(text) =>
                                setSelectedGroup({
                                    ...selectedGroup,
                                    numero_alumnos: text,
                                })
                            }
                            placeholder="30"
                            keyboardType="numeric"
                            inputMode="numeric"
                        />
                    </View>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Grupo activo?</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedGroup?.estado}
                                onValueChange={(itemValue) =>
                                    setSelectedGroup({
                                        ...selectedGroup,
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
                            onPress={
                                selectedGroup?.id_grupo
                                    ? tursoHandleEdit
                                    : tursoAddGroup
                            }
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

    dataText: { color: colors.onAccent },

    addButton: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        width: "100%",
    },

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
        textAlign: "center",
    },
});
