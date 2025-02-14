// _layout.js
import { AuthProvider } from "@/context/authContext";
import { AuthContext } from "@/context/authContext";
import { Stack, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import React from "react";

export default function Layout() {
    return (
        <AuthProvider>
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
                        name="home/home"
                        options={{ title: "Inicio" }}
                    />

                    <Drawer.Screen
                        name="home/users"
                        options={{ title: "Usuarios" }}
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
                onPress={() => navigation.navigate("home/home")}
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

            {isAuthenticated && (
                <TouchableOpacity onPress={logout} style={style.options}>
                    <Text style={style.logout}>Cerrar sesión</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const style = StyleSheet.create({
    drawer: {
        flex: 1,
        padding: 20,
        gap: 20,
    },
    options: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#f4edff",
    },
    textOptions: {
        fontWeight: "600",
        fontSize: 16,
        padding: 10,
    },
    logout: {
        color: "#CB413F",
        fontWeight: "600",
        fontSize: 16,
        padding: 10,
    },
});
