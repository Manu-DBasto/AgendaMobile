import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
    Modal,
    TextInput,
    Button,
} from "react-native";
import config from "@/components/config";
import { Picker } from "@react-native-picker/picker";
import { useState, useEffect, useContext } from "react";
import { colors } from "@/assets/utilities/colors";
import { Link } from "expo-router";
import { AuthContext } from "@/context/authContext";

const isDesktop = typeof window !== "undefined" && window.innerWidth > 800;

export default function simpleHorario() {
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [horarios, setHorarios] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [nextModuleSame, setNextModuleSame] = useState(false);
    const [selectedProfesor, setSelectedProfesor] = useState("");
    const [selectedGrupo, setSelectedGrupo] = useState("");
    const [profesores, setProfesores] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [selectedDay, setSelectedDay] = useState("Lunes");
    const { user } = useContext(AuthContext);


    const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    const startTime = 7 * 60;
    const endTime = 15 * 60 + 10;
    const moduleDuration = 50;
    const breakTimes = [
        { start: 8 * 60 + 40, end: 9 * 60 },
        { start: 12 * 60 + 20, end: 12 * 60 + 40 },
    ];

    const { width } = useWindowDimensions();

    const isMobile = width < 600;

    useEffect(() => {
        pullHorarios();
        fetchProfesores();
        fetchGrupos();
    }, []);
    const [nuevoGrupo, setNuevoGrupo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [nuevoGrupoOcupar, setNuevoGrupoOcupar] = useState("");


    const pullHorarios = async () => {
        try {
            const response = await fetch(
                `https://tursosv.onrender.com/horario`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setHorarios(data.horario);
                console.log("Horarios obtenidos correctamente");
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("No se pudo conectar al servidor.");
        }
    };

    const fetchProfesores = async () => {
        try {
            const response = await fetch(
                `https://tursosv.onrender.com/usuarios`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

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
            const response = await fetch(
                `https://tursosv.onrender.com/grupos`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

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
            (breakPeriod) =>
                time < breakPeriod.end && moduleEnd > breakPeriod.start
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
        start: `${Math.floor(mod.start / 60)}:${(mod.start % 60)
            .toString()
            .padStart(2, "0")}`,
        end: `${Math.floor(mod.end / 60)}:${(mod.end % 60)
            .toString()
            .padStart(2, "0")}`,
        isBreak: mod.isBreak,
        days: daysOfWeek.map((day) => {
            const horario = horarios.find(
                (h) =>
                    h.dia === day &&
                    convertToMinutes(h.hora_inicio) === mod.start &&
                    convertToMinutes(h.hora_fin) === mod.end
            );
            return {
                id: horario ? horario.id_horario : null,
                profesorId: horario ? horario.profesor || "" : "",
                grupoId: horario ? horario.grupo || "" : "",
                estado: horario ? horario.estado : 1,
                dia: horario ? horario.dia : day,
                carrera: horario ? horario.carrera : "",
                isBreak: mod.isBreak,
            };
        }),
    }));
    const handleCellPress = (day, index, item) => {
        setSelectedCell(day, index);


        // Agregar las horas al estado del modal
        setHoraInicio(item.start);
        setHoraFin(item.end);

        if (day.id) {
            setShowModal1(true);// Abrir modal "Ocupar"
        } else {

            setShowModal2(true); // Abrir modal "Solicitar"
        }
    };




    const getProfessorColor = (profesorId) => {
        // Lista de colores predefinidos
        const colors = [
            "#FFDDC1",
            "#CFE2F3",
            "#D9EAD3",
            "#FFE4E1",
            "#E6E6FA",
            "#F0FFF0",
            "#F5F5DC",
            "#FFFACD",
            "#E0FFFF",
            "#FFF5EE",
            "#FFCCCC",
            "#CCE2FF",
            "#CCFFCC",
            "#FFCCFF",
            "#FFFFCC",
            "#CCFFFF",
            "#FFE5CC",
            "#E5CCFF",
            "#CCFFE5",
            "#FFCCE5",
        ];

        // Si el profesorId es válido, selecciona un color de la lista
        if (profesorId) {
            // Usamos el código hash del profesorId para seleccionar un color
            const hash = profesorId
                .split("")
                .reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return colors[hash % colors.length];
        }

        // Color por defecto si no hay profesorId
        return "#FFFFFF"; // Blanco
    };
    const handleSave = async () => {
        if (!user?.id_usuario) {
            alert("Por favor, seleccione un usuario.");
            return;
        }
        if (!nuevoGrupoOcupar) {
            alert("Por favor, seleccione un grupo.");
            return;
        }
        if (!selectedCell) {
            alert("Por favor, seleccione un horario.");
            return;
        }

        const { item, index } = selectedCell;
        const day = daysOfWeek[index];



        //const hora_inicio = `${String(Math.floor(item.start / 60)).padStart(2, "0")}:${String(item.start % 60).padStart(2, "0")}:00`;
        //const hora_fin = `${String(Math.floor(item.end / 60)).padStart(2, "0")}:${String(item.end % 60).padStart(2, "0")}:00`;

        let nuevoGrupoOcuparInt = parseInt(nuevoGrupoOcupar, 10);
        let users = user.id_usuario.toString();


        console.log("Datos a enviar:", {
            hora_inicio: horaInicio,
            hora_fin: horaFin,
            dia: selectedCell.dia,
            id_usuario: users, // Asigna el horario al usuario autenticado
            id_grupo: nuevoGrupoOcuparInt,
        });

        try {
            const response = await fetch(
                `https://tursosv.onrender.com/up-horario`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        hora_inicio: horaInicio,
                        hora_fin: horaFin,
                        dia: selectedCell.dia,
                        id_usuario: users, // Asigna el horario al usuario autenticado
                        id_grupo: nuevoGrupoOcupar,
                    }),
                }
            );

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                pullHorarios();
                fetchProfesores();
                fetchGrupos();
                setShowModal2(false); // Cerrar modal si la operación fue exitosa
            } else {
                setShowModal2(false);
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error al guardar el horario:", error);
            alert("Ocurrió un error al guardar el horario.");
        }
    };

    const handleSavee = async () => {
        if (!user?.id_usuario) {
            alert("Por favor, seleccione un usuario.");
            return;
        }
        if (!nuevoGrupoOcupar) {
            alert("Por favor, seleccione un grupo.");
            return;
        }
        if (!selectedCell) {
            alert("Por favor, seleccione un horario.");
            return;
        }
        let nuevoGrupoOcuparInt = parseInt(nuevoGrupoOcupar, 10);
        function formatToTime(hora) {
            return hora + ":00";  // Añadimos los segundos (00)
        }

        let horaInicioFormatted = formatToTime(horaInicio);
        let horaFinFormatted = formatToTime(horaFin);
        let users = user.id_usuario.toString();

        console.log("horaInicio:", horaInicioFormatted);  // 7:00:00
        console.log("horaFin:", horaFinFormatted);  // 7:50:00
        console.log("nuevoGrupoOcupar:", nuevoGrupoOcupar);
        console.log("datos dia:", selectedCell.dia);
        console.log("usuario a enviar:", users)




        try {
            const response = await fetch(`https://tursosv.onrender.com/up-horario`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    hora_inicio: horaInicioFormatted,
                    hora_fin: horaFinFormatted,
                    dia: selectedCell.dia,
                    id_usuario: users, // Asigna el horario al usuario autenticado
                    id_grupo: nuevoGrupoOcupar,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                pullHorarios(); // Recargar horarios
                fetchProfesores();
                fetchGrupos();
                setShowModal2(false); // Cerrar modal
            } else {
                alert(`Error: ${result.message}`);
                pullHorarios(); // Recargar horarios
                fetchProfesores();
                fetchGrupos();
                setShowModal2(false);

            }
        } catch (error) {
            console.error("Error al guardar el horario:", error);
            alert("Ocurrió un error al guardar el horario.");
            setShowModal2(false);
        }
    };
    const handleSoli = async () => {


        if (!user?.id_usuario) {
            alert("Por favor, seleccione un usuario.");
            return;
        }
        if (!nuevoGrupo) {
            alert("Por favor, seleccione un grupo.");
            return;
        }
        if (!selectedCell) {
            alert("Por favor, seleccione un horario.");
            return;
        }
        if (!descripcion) {
            alert("Por favor, escriba una descripcion");
            return;
        }
        let nuevoGrupoOcuparInt = parseInt(nuevoGrupoOcupar, 10);
        let users = user.id_usuario.toString();


        console.log("Datos a enviar:", {
            hora_inicio: horaInicio,
            hora_fin: horaFin,
            dia: selectedCell.dia,
            id_usuario: users, // Asigna el horario al usuario autenticado
            id_grupo: nuevoGrupoOcuparInt,
            descripcion: descripcion,
        });

        try {
            // Preparar los datos para la solicitud
            const requestData = {
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                dia: selectedCell.dia, // Asegúrate de que esta propiedad existe
                id_solicitante: users, // Asumiendo que tienes el usuario disponible
                id_grupo_nuevo: nuevoGrupo,
                descripcion: descripcion,
                estado: "Pendiente", // Estado por defecto
            };

            // Realizar la solicitud POST usando el método similar a fetchGrupos
            const response = await fetch(
                `https://tursosv.onrender.com/up-solicitud`,
                {
                    // Usar config.serverUrl para la URL
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                }
            );

            const result = await response.json();

            if (response.ok) {
                setShowModal1(false);
                alert(result.message);
            } else {
                setShowModal1(false);
                alert("Error al procesar la solicitud: " + result.message);
            }
        } catch (error) {
            setShowModal1(false);
            console.error("Error al guardar la solicitud:", error);
            alert("Hubo un problema al guardar la solicitud.");
        }

        // Cerrar el modal después de guardar
         // Abrir modal "Solicitar"
    };

    const handleSavea = async () => {

        let nuevoGrupoOcuparInt = parseInt(nuevoGrupoOcupar, 10);
        console.log("nuevoGrupoOcupar:", nuevoGrupoOcuparInt);  // Asegúrate de que este valor esté correcto
        console.log("horaInicio:", horaInicio);  // Asegúrate de que estos valores estén correctos
        console.log("horaFin:", horaFin);
        const { item, index } = selectedCell;
        const day = daysOfWeek[index];

        console.log("datos dia:", selectedCell.dia);
        console.log("usuario a envbiar:", user.id_usuario)

        // Función para asegurarse de que el formato sea HH:MM:SS
        function formatToTime(hora) {
            return hora + ":00";  // Añadimos los segundos (00)
        }

        let horaInicioFormatted = formatToTime(horaInicio);
        let horaFinFormatted = formatToTime(horaFin);

        console.log("horaInicio:", horaInicioFormatted);  // 7:00:00
        console.log("horaFin:", horaFinFormatted);  // 7:50:00



        // El resto del código
    };
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.instruction}>
                    Presione para solicitar u ocupar el horario.
                </Text>
                <View style={styles.headerButtons}>
                    <Link href={{ pathname: "/" }} style={styles.link}>
                        {"<"} Volver
                    </Link>
                </View>
            </View>

            {isMobile && (
                <Picker
                    selectedValue={selectedDay}
                    onValueChange={(itemValue) => setSelectedDay(itemValue)}
                >
                    {daysOfWeek.map((day, index) => (
                        <Picker.Item key={index} label={day} value={day} />
                    ))}
                </Picker>
            )}
            {/* Horario */}
            <FlatList
                data={fullSchedule}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.timeCell}>{item.start} - {item.end}</Text>
                        {item.days.map((day, index) => {
                            if (isMobile && day.dia !== selectedDay) return null;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.cell,
                                        day.isBreak && styles.breakCell,
                                        !day.isBreak && {
                                            backgroundColor: getProfessorColor(day.profesorId),
                                        },
                                    ]}
                                    disabled={day.isBreak}
                                    onPress={() => handleCellPress(day, index, item)}
                                >
                                    <Text style={styles.professorText}>
                                        {day.isBreak ? "Descanso" : `${day.profesorId}`}
                                    </Text>
                                    <Text style={styles.groupText}>
                                        {day.isBreak ? "" : day.grupoId ? `Grupo: ${day.grupoId}` : ""}
                                    </Text>
                                    <Text style={styles.groupText}>
                                        {day.carrera ? `Carrera: ${day.carrera}` : ""}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            />

            {/* Modal Solicitar */}
            <Modal visible={showModal1} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <Text style={styles.label}>Solicitar</Text>
                        <Text>{selectedCell?.dia} - {horaInicio} a {horaFin}</Text>

                        <Text style={styles.label}>Grupo Nuevo:</Text>
                        <Picker
                            selectedValue={nuevoGrupo}
                            style={styles.input}
                            onValueChange={setNuevoGrupo}
                        >
                            <Picker.Item label="Seleccionar Grupo" value="" />
                            {grupos.map((grupo) => (
                                <Picker.Item
                                    key={grupo.id_grupo}
                                    label={`${grupo.nombre_grupo} - ${grupo.carrera}`}
                                    value={grupo.id_grupo}
                                />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={styles.input}
                            value={descripcion}
                            onChangeText={setDescripcion}
                            placeholder="Describe tu solicitud"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => setShowModal1(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSoli}>
                                <Text style={styles.buttonText}>Solicitar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal Ocupar */}
            <Modal visible={showModal2} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <Text style={styles.label}>Ocupar</Text>
                        <Text>{selectedCell?.dia} - {horaInicio} a {horaFin}</Text>

                        <Text style={styles.label}>Grupo Nuevo:</Text>
                        <Picker
                            selectedValue={nuevoGrupoOcupar}
                            style={styles.input}
                            onValueChange={setNuevoGrupoOcupar}
                        >
                            <Picker.Item label="Seleccionar Grupo" value="" />
                            {grupos.map((grupo) => (
                                <Picker.Item
                                    key={grupo.id_grupo}
                                    label={`${grupo.nombre_grupo} - ${grupo.carrera}`}
                                    value={grupo.id_grupo}
                                />
                            ))}
                        </Picker>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => setShowModal2(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave}>
                                <Text style={styles.buttonText}>Ocupar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );

}

const styles = StyleSheet.create({
    headerButtons: {
        flexDirection: "row",
    },
    notiButton: {
        marginLeft: "auto",
        backgroundColor: colors.greenBackground,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        paddingHorizontal: 4,
    },
    instruction: {
        fontSize: 16,
        fontWeight: 700,
        textAlign: "center",
        color: colors.secondary,
    },
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        paddingHorizontal: 50,
        paddingVertical: 10,
        gap: 10,

    },
    scrollView: {
        flex: 1,
        width: "100%",
    },
    table: {
        flex: 1,
        borderRadius: 10,
        overflow: "hidden",
        borderColor: "#d0d0d0",
        borderWidth: 1,
    },
    headerRow: {
        flexDirection: "row",
        backgroundColor: "#ededed",
        paddingVertical: 10,
        // borderBottomWidth: 2,
        // borderBottomColor: "#bbb",
    },
    headerCell: {
        flex: 1,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    headerHora: {
        flex: 1,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        maxWidth: 150,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 20,
    },
    timeCell: {
        backgroundColor: "#ededed",
        flex: 1,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        paddingVertical: 20,
        height: "100%",
        borderWidth: 1,
        borderColor: "#d7d7d7",
        maxWidth: 150,
    },
    breakTimeCell: {
        minHeight: 20,
        paddingVertical: 3,
    },
    cell: {
        flex: 1,
        paddingVertical: 2,
        paddingHorizontal: 5,
        // backgroundColor: "#fff",
        // margin: 2,
        alignItems: "center",
        // borderRadius: 5,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.2,
        // shadowRadius: 1.5,
        // elevation: 2,
        height: "100%",
        borderWidth: 1,
        borderColor: "#d7d7d7",
    },
    breakCell: {
        backgroundColor: "#ffcc80",
        borderWidth: 1,
        borderColor: "gray",
        borderColor: "#d7d7d7",
        height: 30,
    },
    professorText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "gray",
    },
    groupText: {
        fontSize: 10,
        color: "gray",
    },
    careerText: {
        fontSize: 10,
        color: "#888",
        fontStyle: "italic",
    },
    link: {
        color: colors.primary,
        fontWeight: "700",
        textDecorationLine: "underline",
    },
    //Estilos del modal
    modalContainer: {
        marginTop: 250,
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
