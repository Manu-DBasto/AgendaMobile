import { Platform } from "react-native";

const config = {
    serverUrl:
        Platform.OS === "web"
            ? "http://localhost:8080"
            : "http://172.16.7.83:8080",
};

export default config;
