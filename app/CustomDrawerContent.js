import { Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/authContext";

function CustomDrawerContent(props) {
    const { navigation } = props;
    const { userRole, handleLogout } = useAuth(); // Usa el contexto
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
