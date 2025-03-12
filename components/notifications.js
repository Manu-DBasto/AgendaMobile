import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Button,
} from "react-native";

const Notifications = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(
                "https://tursosv.onrender.com/solicitudes",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ search: "" }),
                }
            );
            const data = await response.json();

            if (response.ok) {
                setNotifications(data.solicitudes);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("No se pudo obtener las notificaciones.");
        }
    };

    const openModal = () => {
        fetchNotifications();
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity style={styles.notiButton} onPress={openModal}>
                <Text>Notificaciones</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Notificaciones</Text>
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <View
                                    key={index}
                                    style={styles.notificationItem}
                                >
                                    <Text>{notification.descripcion}</Text>
                                </View>
                            ))
                        ) : (
                            <Text>No hay notificaciones nuevas.</Text>
                        )}
                        <Button title="Cerrar" onPress={closeModal} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    notiButton: {
        marginLeft: "auto",
        backgroundColor: "#4CAF50",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    notificationItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        width: "100%",
    },
});

export default Notifications;
