import { Platform } from "react-native";

const config = {
    serverUrl:
        Platform.OS === "web"
            ? "http://localhost:8080"
            : "http://192.168.1.65:8080",
};

export default config;
