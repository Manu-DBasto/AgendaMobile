import { AuthProvider } from "@/context/authContext";
import { Stack, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomDrawerContent from "@/app/CustomDrawerContent.js";

export default function Layout() {
    const router = useRouter();

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
