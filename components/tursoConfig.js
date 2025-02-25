import { Platform } from "react-native";

const config = {
    serverUrl:
        Platform.OS === "web"
            ? "http://localhost:3000"
            : "http://172.16.7.83:3000",
};

export default config;
