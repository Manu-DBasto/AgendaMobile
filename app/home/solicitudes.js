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

export default function Solicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        tursoFetchSolicitudes(search);
    }, [search]);

    const tursoFetchSolicitudes = async (searchTerm) => {
        try {
            const response = await fetch(
                `https://tursosv.onrender.com/solicitudes`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ search: searchTerm }),
                }
            );
            const data = await response.json();
            setSolicitudes(data.solicitudes);
        } catch (error) {
            console.error("Error fetching solicitudes:", error);
        }
    };

    const tursoCancelSoli = async () => {
        if (!selectedSolicitud) return;
        try {
            const response = await fetch(
                `https://tursosv.onrender.com/solicitudes/cancelar`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_solicitud: selectedSolicitud.id_solicitud,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                console.log(data.message);
                tursoFetchSolicitudes(); // Recargar la lista de solicitudes
                setModalVisible(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error al cancelar la solicitud:", error);
            alert("Hubo un error al cancelar la solicitud.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Solicitudes</Text>
            <Text style={styles.instruction}>
                Toque o haga click en la solicitud para editar
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
                    <DataTable.Title>Hora Inicio</DataTable.Title>
                    <DataTable.Title>Hora Fin</DataTable.Title>
                    <DataTable.Title>Día</DataTable.Title>
                    <DataTable.Title>Solicitante</DataTable.Title>
                    <DataTable.Title>Grupo Nuevo</DataTable.Title>
                    <DataTable.Title>Estado</DataTable.Title>
                </DataTable.Header>
                <FlatList
                    data={solicitudes}
                    keyExtractor={(solicitudes) =>
                        solicitudes.id_solicitud.toString()
                    }
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedSolicitud(item);
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
                                    {item.hora_inicio}
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.dataText}>
                                    {item.hora_fin}
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.dataText}>
                                    {item.dia}
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.dataText}>
                                    {item.solicitante}
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.dataText}>
                                    {item.grupo_nuevo}
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.dataText}>
                                    {item.estado}
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
                    <Text style={styles.title}>Solicitud</Text>

                    <View style={{ gap: 5 }}>
                        <Text style={styles.label}>Estado</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedSolicitud?.estado}
                                onValueChange={(itemValue) =>
                                    setSelectedSolicitud({
                                        ...selectedSolicitud,
                                        estado: itemValue,
                                    })
                                }
                                style={styles.picker}
                                enabled={false} // Solo visualización
                            >
                                <Picker.Item
                                    label="Pendiente"
                                    value="Pendiente"
                                />
                                <Picker.Item
                                    label="Aprobada"
                                    value="Aprobada"
                                />
                                <Picker.Item
                                    label="Rechazada"
                                    value="Rechazada"
                                />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancel]}
                            onPress={tursoCancelSoli}
                        >
                            <Text style={styles.buttonText}>
                                Cancelar Solicitud
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.cancel]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Salir</Text>
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
