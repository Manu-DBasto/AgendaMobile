// _layout.js
import { AuthProvider } from "@/context/authContext";
import { AuthContext } from "@/context/authContext";
import { Stack, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity, Text, View } from "react-native";
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

            {isAuthenticated && (
                <TouchableOpacity
                    onPress={logout}
                    style={{ paddingVertical: 10, marginTop: 20 }}
                >
                    <Text style={{ fontSize: 18, color: "red" }}>
                        Cerrar sesión
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
