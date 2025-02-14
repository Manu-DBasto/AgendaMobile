import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import config from "@/components/config";
import { useState, useEffect } from "react";

export default function Horario() {
    const [horarios, setHorarios] = useState([]);
    const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    const startTime = 7 * 60;
    const endTime = 15 * 60 + 10;
    const moduleDuration = 50;
    const breakTimes = [
        { start: 8 * 60 + 40, end: 9 * 60 },
        { start: 12 * 60 + 20, end: 12 * 60 + 40 },
    ];

    const { width } = useWindowDimensions();
    const isDesktop = width > 800;

    useEffect(() => {
        pullHorarios();
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

    // Función para convertir la hora (HH:mm:ss) a minutos
    const convertToMinutes = (time) => {
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
                profesorId: horario ? horario.id_usuario || "Libre" : "Libre",
                grupoId: horario ? horario.id_grupo || "Libre" : "Libre",
                isBreak: mod.isBreak,
            };
        }),
    }));

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
                                        onPress={() => console.log(`Tocaste ${item.start} - ${item.end} en ${daysOfWeek[index]}`)}
                                        style={[styles.cell, day.isBreak && styles.breakCell]}
                                        disabled={day.isBreak}
                                    >
                                        <Text style={styles.professorText}>{day.isBreak ? "Descanso" : `Prof: ${day.profesorId}`}</Text>
                                        <Text style={styles.groupText}>{day.isBreak ? "" : `Grupo: ${day.grupoId}`}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
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
});
