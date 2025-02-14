import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity, Text, View } from "react-native";

export default function Layout() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            const userSession = await AsyncStorage.getItem("userSession");
            if (userSession) {
                const parsedSession = JSON.parse(userSession);
                console.log(userSession);
                setIsAuthenticated(true);
                setUserRole(parsedSession.rol);
            } else {
                setIsAuthenticated(false);
                router.replace("/"); // Redirige a login si no hay sesión
            }
        };
        checkSession();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userSession");
        setUserRole(null);
        router.replace("/");
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#9146FF",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
                drawerContent={(props) => (
                    <CustomDrawerContent
                        {...props}
                        handleLogout={handleLogout}
                        userRole={userRole}
                    />
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

                <Drawer.Screen name="home/home" options={{ title: "Inicio" }} />

                <Drawer.Screen
                    name="home/users"
                    options={{ title: "Usuarios" }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}

function CustomDrawerContent(props) {
    const { handleLogout, navigation, userRole } = props;
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TouchableOpacity
                onPress={() => navigation.navigate("home/home")}
                style={{ paddingVertical: 10 }}
            >
                <Text style={{ fontSize: 18 }}>Inicio</Text>
            </TouchableOpacity>

            {userRole === "admin" && (
                <TouchableOpacity
                    onPress={() => navigation.navigate("home/users")}
                    style={{ paddingVertical: 10 }}
                >
                    <Text style={{ fontSize: 18 }}>Usuarios</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                onPress={handleLogout}
                style={{ paddingVertical: 10, marginTop: 20 }}
            >
                <Text style={{ fontSize: 18, color: "red" }}>
                    Cerrar sesión
                </Text>
            </TouchableOpacity>
        </View>
    );
}
