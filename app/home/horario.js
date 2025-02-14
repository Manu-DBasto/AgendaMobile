import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Dimensions, useWindowDimensions } from "react-native";
import { Link, useNavigation, useRouter } from "expo-router";
import config from "@/components/config";


export default function Horario() {
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
        days: daysOfWeek.map((day) => ({
            subject: mod.isBreak ? "Descanso" : "Materia Y",
            professor: mod.isBreak ? "" : "Profesor X",
            isBreak: mod.isBreak,
        })),
    }));

    return (
        <View style={styles.container}>
            <ScrollView horizontal={!isDesktop} style={styles.scrollView}>
                <View style={[styles.table, { width: isDesktop ? "100%" : width }]}>
                    {/* Encabezado */}
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell}>Hora</Text>
                        {daysOfWeek.map((day, index) => (
                            <Text key={index} style={styles.headerCell}>{day}</Text>
                        ))}
                    </View>

                    {/* Filas de horario */}
                    <FlatList
                        data={fullSchedule}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.row}>
                                {/* Hora */}
                                <Text style={styles.timeCell}>{item.start} - {item.end}</Text>

                                {/* Celdas de días */}
                                {item.days.map((day, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => console.log(`Tocaste ${item.start} - ${item.end} en ${daysOfWeek[index]}`)}
                                        style={[styles.cell, day.isBreak && styles.breakCell]}
                                        disabled={day.isBreak}
                                    >
                                        <Text style={styles.subjectText}>{day.subject}</Text>
                                        <Text style={styles.professorText}>{day.professor}</Text>
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
    desktopTable: {
        width: "100%",


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
    subjectText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    professorText: {
        fontSize: 12,
        color: "#555",
    },
});
