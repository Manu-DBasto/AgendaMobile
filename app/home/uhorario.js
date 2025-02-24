import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, Modal, TextInput, Button, Picker } from "react-native";
import config from "@/components/config";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
const isDesktop = typeof window !== 'undefined' && window.innerWidth > 800;



export default function Horario() {
    const [usuario, setUsuario] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [motivoSolicitud, setMotivoSolicitud] = useState("");
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

    // Función para convertir la hora (HH:mm:ss) a minutos
    const convertToMinutes = (time) => {
        if (!time) {
            console.error("Valor de hora inválido:", time);
            return NaN;
        }
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
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

    const fullSchedule = schedule.map((mod) => ({
        start: `${Math.floor(mod.start / 60)}:${(mod.start % 60).toString().padStart(2, "0")}`,
        end: `${Math.floor(mod.end / 60)}:${(mod.end % 60).toString().padStart(2, "0")}`,
        isBreak: mod.isBreak,
        days: daysOfWeek.map((day) => {
            const horario = horarios.find(h =>
                h.dia === day &&
                convertToMinutes(h.hora_inicio) === mod.start &&
                convertToMinutes(h.hora_fin) === mod.end
            );
            return {
                id: horario ? horario.id_horario : null,
                profesorId: horario ? horario.profesor || "Libre" : "Libre",
                grupoId: horario ? horario.grupo || "Libre" : "Libre",
                estado: horario ? horario.estado : 1,
                dia: horario ? horario.dia : day,
                carrera: horario ? horario.carrera : "",
                isBreak: mod.isBreak,
            };
        }),
    }));


    useEffect(() => {
        const checkSession = async () => {
            try {
                const userSession = await AsyncStorage.getItem("userSession");
                console.log(userSession)
                if (userSession) {
                    const user = JSON.parse(userSession); // Convertir a objeto
                    setUsuario(user.id_usuario); // Acceder correctamente a id_usuario
                }
            } catch (error) {
                console.error("Error al obtener la sesión:", error);
            }
        };

        checkSession();
    }, []);

    const handleCellPress = (item, index) => {
        setSelectedCell({ item, index });
        setSelectedGrupo(item.days[index].grupoId);
        setHoraInicio(item.start);
        setHoraFin(item.end);
        setMotivoSolicitud("");  // Limpiar el campo de motivo
        setShowModal(true);
    };


    const handleSave = async () => {
        console.log("Guardar");
        console.log("Grupo Nuevo:", selectedGrupo);
        console.log("Celda", selectedCell);
        console.log("Usuario", usuario);
        console.log("Hora Inicio:", horaInicio);
        console.log("Hora Fin:", horaFin);
        console.log("Motivo de Solicitud:", motivoSolicitud);
        
        // Verificar si los campos obligatorios están completos
        if (!selectedGrupo || !motivoSolicitud) {
            alert("Por favor, selecciona un grupo y completa el motivo de la solicitud.");
            return;
        }
    
        try {
            // Preparar los datos para la solicitud
            const requestData = {
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                dia: selectedCell.item.days[selectedCell.index].dia, // Asegúrate de que esta propiedad existe
                id_solicitante: usuario, // Asumiendo que tienes el usuario disponible
                id_grupo_nuevo: selectedGrupo,
                descripcion: motivoSolicitud,
                estado: "Pendiente", // Estado por defecto
            };
    
            // Realizar la solicitud POST usando el método similar a fetchGrupos
            const response = await fetch(`${config.serverUrl}/up-solicitud`, {  // Usar config.serverUrl para la URL
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                alert(result.message);
            } else {
                alert("Error al procesar la solicitud: " + result.message);
            }
        } catch (error) {
            console.error("Error al guardar la solicitud:", error);
            alert("Hubo un problema al guardar la solicitud.");
        }
    
        // Cerrar el modal después de guardar
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
                                        <Text style={styles.professorText}>{day.isBreak ? "Descanso" : `Prof: ${day.profesorId}`}</Text>
                                        <Text style={styles.groupText}>{day.isBreak ? "" : `Grupo: ${day.grupoId}`}</Text>
                                        <Text style={styles.groupText}>Carrera: {day.carrera}</Text>
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
                    <Text style={styles.modalTitle}>Solicitar Horario</Text>

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

                    <Text>Hora Inicio: {horaInicio}</Text>
                    <Text>Hora Fin: {horaFin}</Text>

                    <Text>Motivo de Solicitud:</Text>
                    <TextInput
                        value={motivoSolicitud}
                        onChangeText={setMotivoSolicitud}
                        placeholder="Escribe el motivo de la solicitud"
                        multiline={true}
                        numberOfLines={4}
                        style={[styles.input, styles.textArea]}
                    />

                    <Button title="Solicitar" onPress={handleSave} />
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
    textArea: {
        width: '100%', // Asegura que ocupe el 100% del ancho disponible
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc', // Color del borde
        borderRadius: 5,
        height: 100, // Ajusta la altura para un campo más extenso
        textAlignVertical: 'top', // Alineación del texto al principio del campo
    },
});
