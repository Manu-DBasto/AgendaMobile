import { View, Text, Button } from "react-native";
import { Link, useNavigation, useRouter } from "expo-router";

export default function HomeScreen() {
    const navigation = useNavigation(); // Permite acceder a funciones de navegación

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 20 }}>Bienvenido a la Home</Text>
            {/* <Button
                title="Abrir Menú"
                onPress={() => navigation.openDrawer()}
            /> */}
        </View>
    );
}
