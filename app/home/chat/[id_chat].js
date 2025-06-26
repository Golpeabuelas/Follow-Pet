import { View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, Image } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useEffect, useState, useRef } from "react"
import { useFonts } from "expo-font"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { API_URL } from "../../../consts"
import { socket } from "../../../socket"

export default function ChatDetailScreen() {
    const { id_chat } = useLocalSearchParams()
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const [mensaje, setMensaje] = useState("")
    const [mensajes, setMensajes] = useState([])
    const [nombreReceiver, setNombreReceiver] = useState(null)
    const [photoReceiver, setPhotoReceiver] = useState(null)

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../../assets/fonts/Montserrat-Regular.ttf")
    })

    useEffect(() => {
        const cargarInfoUser = async () => {
            const token = await AsyncStorage.getItem("userToken")

            if (!token) {
                console.error("Token no encontrado");
                return;
            }

            const result = await fetch(`${API_URL}/get-info-receiver/${id_chat}/${token}`)
            const info = await result.json()

            setNombreReceiver(info.usuario.nombre_usuario)
            setPhotoReceiver(info.usuario.foto_usuario)
        }

        cargarInfoUser()
        cargarMensajes()
    }, []);

    useEffect(() => {
        socket.connect()

        socket.on('chat-message', () => {
            cargarMensajes()
        })
    }, [id_chat])

    const cargarMensajes = async () => {
        const token = await AsyncStorage.getItem("userToken")

        if (!token) {
            console.error("Token no encontrado");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/get-messages-from-chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_chat, token }),
            });

            const data = await res.json();

            if (data.status === 200) {
                setMensajes(data.mensajes)
            } else {
                console.error("Error:", data.error)
            }
        } catch (err) {
            console.error("Error al cargar mensajes:", err)
        }
    }

    const sendMessage = async (message) => {
        if (!message.trim()) return; 

        try {
            const token = await AsyncStorage.getItem("userToken");
            
            if (!token) {
                console.error("Token no encontrado");
                return;
            }

            const res = await fetch(`${API_URL}/create-message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    id_chat,
                    mensaje: message.trim(),
                }),
            });

            const data = await res.json();

            if (data.status === 200) {
                setMensaje(""); 
                socket.emit('chat-message')
            } else {
                console.error("Error al enviar mensaje:", data.error);
            }
        } catch (error) {
            console.error("Error en sendMessage:", error);
        }
    };


    if (!fontsLoaded) return null

    return (
        <KeyboardAvoidingView className="flex-1 bg-[#FFF9F0]" behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View className="pt-4 px-4 pb-2 flex-row items-center bg-[#FFF9F0]" style={{ paddingTop: insets.top + 10 }}>
                <Pressable onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#5E5E5E" />
                </Pressable>
                <Image source={{ uri: `${API_URL}${photoReceiver}` }} className="w-10 h-10 rounded-full mr-3" />
                <Text className="text-lg font-semibold text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
                    {nombreReceiver}
                </Text>
            </View>

            <FlatList
                data={mensajes}
                keyExtractor={(item) => item.id_mensaje.toString()}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, flexGrow: 1 }}
                renderItem={({ item }) => (
                    <View className={`mb-3 max-w-[70%] rounded-xl px-4 py-2 ${item.propio ? "self-end bg-[#D1E7FF]" : "self-start bg-white"}`}>
                        <Text className="text-[#333]" style={{ fontFamily: "Montserrat" }}>{item.mensaje}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center mt-10">
                        <Text className="text-[#888] text-base text-center" style={{ fontFamily: "Montserrat" }}>
                            Aún no se han enviado mensajes en este chat.
                        </Text>
                    </View>
                }
            />

            <View className="flex-row items-center px-4 py-3 border-t border-[#DDD] bg-white">
                <TextInput
                    placeholder="Escribe un mensaje..."
                    value={mensaje}
                    onChangeText={setMensaje}
                    className="flex-1 bg-[#F4F4F4] rounded-full px-4 py-2 text-[#333]"
                    style={{ fontFamily: "Montserrat" }}
                />
                <Pressable className="ml-3" onPress={() => sendMessage(mensaje)}>
                    <Ionicons name="send" size={24} color="#FFBD59" />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    )
}
