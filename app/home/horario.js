import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, Modal, TextInput, Button, Picker } from "react-native";
import config from "@/components/config";
import { useState, useEffect } from "react";

// Condicional para verificar si estamos en un entorno web o móvil
const isDesktop = typeof window !== 'undefined' && window.innerWidth > 800;

export default function Horario() {
    const [horarios, setHorarios] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [nextModuleSame, setNextModuleSame] = useState(false);
    const [selectedProfesor, setSelectedProfesor] = useState("");
    const [selectedGrupo, setSelectedGrupo] = useState("");
    const [profesores, setProfesores] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    const startTime = 7 * 60;
    const endTime = 15 * 60 + 10;
    const moduleDuration = 50;
    const breakTimes = [
        { start: 8 * 60 + 40, end: 9 * 60 },
        { start: 12 * 60 + 20, end: 12 * 60 + 40 },
    ];

    const { width } = useWindowDimensions();

    useEffect(() => {
        pullHorarios();
        fetchProfesores();
        fetchGrupos();
    }, []);

    const pullHorarios = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/horario`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                setHorarios(data.horario);
                console.log("Horarios obtenidos correctamente", data.horario);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("No se pudo conectar al servidor.");
        }
    };

    const fetchProfesores = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/usuarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProfesores(data.usuarios);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("No se pudo obtener los profesores.");
        }
    };

    const fetchGrupos = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/grupos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                setGrupos(data.grupos);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("No se pudo obtener los grupos.");
        }
    };

    let schedule = [];
    let time = startTime;
    while (time + moduleDuration <= endTime) {
        const moduleEnd = time + moduleDuration;
        const isBreak = breakTimes.some(
            (breakPeriod) => time < breakPeriod.end && moduleEnd > breakPeriod.start
        );

        if (isBreak) {
            schedule.push({
                start: Math.max(time, breakTimes[0].start),
                end: breakTimes[0].end,
                isBreak: true,
            });
            time = breakTimes[0].end;
            breakTimes.shift();
        } else {
            schedule.push({ start: time, end: moduleEnd, isBreak: false });
            time = moduleEnd;
        }
    }

    const fullSchedule = schedule.map((mod) => {
        const startFormatted = `${String(Math.floor(mod.start / 60)).padStart(2, "0")}:${(mod.start % 60).toString().padStart(2, "0")}:00`;
        const endFormatted = `${String(Math.floor(mod.end / 60)).padStart(2, "0")}:${(mod.end % 60).toString().padStart(2, "0")}`;

        return {
            start: startFormatted.slice(0, -3),
            end: endFormatted,
            isBreak: mod.isBreak,
            days: daysOfWeek.map((day) => {
                const horario = horarios.find(h => h.dia === day && h.hora_inicio === startFormatted);
                return {
                    profesor: horario ? horario.profesor || "Libre" : "Libre",
                    grupo: horario ? horario.grupo || "Libre" : "Libre",
                    carrera: horario ? horario.carrera || "Sin carrera" : "Sin carrera",
                    isBreak: mod.isBreak,
                };
            }),
        };
    });

    const handleCellPress = (mod, dayIndex) => {
        setSelectedCell(mod.days[dayIndex]);
        setSelectedProfesor(mod.days[dayIndex].profesor || "");
        setSelectedGrupo(mod.days[dayIndex].grupo || "");
        setShowModal(true);
    };

    const handleSave = () => {
        // Save logic here
        setShowModal(false);
    };

    const handleDelete = () => {
        // Delete logic here
        setShowModal(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal={!isDesktop} style={styles.scrollView}>
                <View style={[styles.table, { width: isDesktop ? "100%" : width }]}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell}>Hora</Text>
                        {daysOfWeek.map((day, index) => (
                            <Text key={index} style={styles.headerCell}>{day}</Text>
                        ))}
                    </View>

                    <FlatList
                        data={fullSchedule}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.row}>
                                <Text style={styles.timeCell}>{item.start} - {item.end}</Text>
                                {item.days.map((day, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleCellPress(item, index)}
                                        style={[styles.cell, day.isBreak && styles.breakCell]}
                                        disabled={day.isBreak}
                                    >
                                        <Text style={styles.professorText}>{day.isBreak ? "Descanso" : `Prof: ${day.profesor}`}</Text>
                                        <Text style={styles.groupText}>{day.isBreak ? "" : `Grupo: ${day.grupo}`}</Text>
                                        <Text style={styles.careerText}>{day.isBreak ? "" : `Carrera: ${day.carrera}`}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    />
                </View>
            </ScrollView>

            <Modal
                visible={showModal}
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
                transparent={true}
                style={styles.modal}
            >
                <View style={[styles.modalContent, isDesktop && styles.modalDesktop]}>
                    <Text style={styles.modalTitle}>Editar Horario</Text>

                    <Text>Profesor Nuevo:</Text>
                    <Picker
                        selectedValue={selectedProfesor}
                        style={styles.input}
                        onValueChange={(itemValue) => setSelectedProfesor(itemValue)}
                    >
                        <Picker.Item label="Seleccionar Profesor" value="" />
                        {profesores.map(profesor => (
                            <Picker.Item key={profesor.id_usuario} label={profesor.nombre_usuario} value={profesor.id_usuario} />
                        ))}
                    </Picker>

                    <Text>Grupo Nuevo:</Text>
                    <Picker
                        selectedValue={selectedGrupo}
                        style={styles.input}
                        onValueChange={(itemValue) => setSelectedGrupo(itemValue)}
                    >
                        <Picker.Item label="Seleccionar Grupo" value="" />
                        {grupos.map(grupo => (
                            <Picker.Item key={grupo.id_grupo} label={`${grupo.nombre_grupo} - ${grupo.carrera}`} value={grupo.id_grupo} />
                        ))}
                    </Picker>

                    <Text>¿Desea cambiar igual el módulo siguiente?</Text>
                    <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => setNextModuleSame(!nextModuleSame)}
                    >
                        <Text>{nextModuleSame ? "✓" : "✘"}</Text>
                    </TouchableOpacity>

                    <View style={styles.buttons}>
                        <Button title="Eliminar" onPress={handleDelete} />
                        <Button title="Guardar" onPress={handleSave} />
                    </View>

                    <Button title="Cerrar" onPress={() => setShowModal(false)} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        padding: 10,
    },
    scrollView: {
        flex: 1,
        width: "100%",
    },
    table: {
        flex: 1,
    },
    headerRow: {
        flexDirection: "row",
        backgroundColor: "#ddd",
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: "#bbb",
    },
    headerCell: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    timeCell: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        paddingVertical: 10,
    },
    cell: {
        flex: 1,
        paddingVertical: 15,
        backgroundColor: "#fff",
        margin: 2,
        alignItems: "center",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
    },
    breakCell: {
        backgroundColor: "#ffcc80",
    },
    professorText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    groupText: {
        fontSize: 12,
        color: "#555",
    },
    careerText: {
        fontSize: 12,
        color: "#888",
        fontStyle: "italic",
    },
    modalContent: {
        padding: 20,
        backgroundColor: "#fff",
        flex: 1,
        justifyContent: "center",  // Centrar el contenido en el modal
        maxHeight: "80%",  // Asegura que el contenido no sobresalga
        overflow: "scroll",  // Permite desplazarse si el contenido es muy largo
    },
    modalDesktop: {
        width: 500,
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    checkbox: {
        padding: 10,
        backgroundColor: "#eee",
        marginBottom: 10,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
        width: "100%", // Para que ocupe el 100% de la pantalla
        height: "100%", // Para asegurarnos de que ocupe toda la altura
    },
});
