// _layout.js
import { AuthProvider } from "@/context/authContext";
import { AuthContext } from "@/context/authContext";
import { Stack, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { colors } from "@/assets/utilities/colors";
import { useNavigation } from "@react-navigation/native";

export default function Layout() {
    return (
        <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Drawer
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: colors.secondary,
                        },
                        headerTintColor: colors.onSecondary,
                        headerTitleStyle: {
                            fontWeight: "bold",
                        },
                    }}
                    drawerContent={(props) => (
                        <CustomDrawerContent {...props} />
                    )}
                >
                    <Drawer.Screen
                        name="index"
                        options={{
                            headerShown: false,
                            drawerItemStyle: { display: "none" },
                        }}
                    />

                    <Drawer.Screen
                        name="register"
                        options={{
                            headerShown: false,
                            drawerItemStyle: { display: "none" },
                        }}
                    />

                    <Drawer.Screen
                        name="simpleHorario"
                        options={{
                            headerShown: false,
                            drawerItemStyle: {
                                display: "none",
                                headerRight: (props) => (
                                    <NotificationButton {...props} />
                                ),
                            },
                        }}
                    />

                    <Drawer.Screen
                        name="home/horario"
                        options={{
                            title: "Administrar horario",
                            headerRight: (props) => (
                                <NotificationButton {...props} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="home/users"
                        options={{
                            title: "Usuarios",
                            headerRight: (props) => (
                                <NotificationButton {...props} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="home/groups"
                        options={{
                            title: "Grupos",
                            headerRight: (props) => (
                                <NotificationButton {...props} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="home/uhorario"
                        options={{
                            title: "Inicio",
                            headerRight: (props) => (
                                <NotificationButton {...props} />
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="home/solicitudes"
                        options={{
                            title: "Solicitudes",
                            headerRight: (props) => (
                                <NotificationButton {...props} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="home/perfil"
                        options={{
                            title: "Perfil",
                            headerRight: (props) => (
                                <NotificationButton {...props} />
                            ),
                        }}
                    />
                </Drawer>
            </GestureHandlerRootView>
        </AuthProvider>
    );
}

function CustomDrawerContent(props) {
    const { navigation } = props;
    const { isAuthenticated, userRole, logout } = React.useContext(AuthContext);

    return (
        <View style={style.drawer}>
            <TouchableOpacity
                onPress={() => navigation.navigate("home/uhorario")}
                style={style.options}
            >
                <Text style={style.textOptions}>Inicio</Text>
            </TouchableOpacity>

            {userRole === "admin" && (
                <TouchableOpacity
                    onPress={() => navigation.navigate("home/users")}
                    style={style.options}
                >
                    <Text style={style.textOptions}>Usuarios</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                onPress={() => navigation.navigate("home/groups")}
                style={style.options}
            >
                <Text style={style.textOptions}>Grupos</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate("home/solicitudes")}
                style={style.options}
            >
                <Text style={style.textOptions}>Solicitudes</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("home/perfil")}
                style={style.options}
            >
                <Text style={style.textOptions}>Perfil</Text>
            </TouchableOpacity>

            {isAuthenticated && (
                <TouchableOpacity onPress={logout} style={style.logoutOption}>
                    <Text style={style.logout}>Cerrar sesión</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

function NotificationButton() {
    const { user } = useContext(AuthContext);
    const [pendingCount, setPendingCount] = useState(0);
    const navigation = useNavigation(); // Aquí obtienes la navegación

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const response = await fetch(
                    `https://tursosv.onrender.com/solicitudes/notificaciones/${user.id_usuario}`
                );
                const data = await response.json();

                if (data.success) {
                    setPendingCount(data.rows);
                }
            } catch (error) {
                console.error("Error obteniendo notificaciones:", error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Actualiza cada 10 seg

        return () => clearInterval(interval);
    }, [user]);

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("home/solicitudes")} // Usa la navegación aquí
            style={style.notificationButton}
        >
            <Text style={style.notificationText}>
                🔔 {pendingCount > 0 ? pendingCount : ""}
            </Text>
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    drawer: {
        flex: 1,
        padding: 20,
        gap: 20,
        backgroundColor: colors.background,
        borderRadius: 20,
    },
    options: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#e8ebf0",
    },
    textOptions: {
        fontWeight: "600",
        fontSize: 16,
        padding: 10,
        color: colors.onAccent,
    },
    logout: {
        color: colors.error,
        fontWeight: "600",
        fontSize: 16,
        padding: 10,
    },

    logoutOption: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#e8ebf0",
        marginTop: "auto",
    },
    notificationButton: {
        marginRight: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: colors.primary,
        borderRadius: 20,
    },
    notificationText: {
        color: colors.onPrimary,
        fontWeight: "bold",
        fontSize: 16,
    },
});
