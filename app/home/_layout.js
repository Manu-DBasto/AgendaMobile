import { Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#690087",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
            >
                <Drawer.Screen name="index" options={{ title: "Inicio" }} />
                <Drawer.Screen name="users" options={{ title: "Usuarios" }} />
            </Drawer>
        </GestureHandlerRootView>
    );
}
