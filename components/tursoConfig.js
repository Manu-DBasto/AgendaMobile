import { Platform } from "react-native";

const config = {
    serverUrl:
        Platform.OS === "web"
            ? "http://localhost:3000"
            : "http://192.168.1.67:3000",
};

export default config;
