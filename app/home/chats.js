import { ScrollView, View, Text, Pressable, Image } from "react-native"
import { useRouter } from "expo-router"
import { useFonts } from "expo-font"
import { API_URL } from "../../consts"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function ChatsScreen() {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    
    const [chats, setChats] = useState([])

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
        MontserratLight: require("../../assets/fonts/Montserrat-Light.ttf")
    })


    useEffect(() => {
        const cargarChats = async () => {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) return

            try {
                const res = await fetch(`${API_URL}/get-chats/${token}`)
                const data = await res.json()

                if (data.status === 200) {
                    setChats(data.chats)
                } else {
                    setChats([])
                }
            } catch (err) {
                console.error("Error al cargar chats:", err)
            }
        }

        cargarChats()
    }, [])

    if (!fontsLoaded) return null

    return (
        <ScrollView style={{ paddingTop: insets.top }} className="flex-1 bg-[#FFF9F0] px-6">
            <Text className="text-2xl font-semibold text-[#5E5E5E] mb-4" style={{ fontFamily: "Montserrat" }}>
                Tus chats
            </Text>

            {chats.length === 0 ? (
                <Text className="text-[#888] text-center mt-10" style={{ fontFamily: "Montserrat" }}>
                    No tienes chats activos.
                </Text>
            ) : (
                chats.map((chat) => (
                    <Pressable
                        key={chat.id_chat}
                        onPress={() => router.push({
                            pathname: `/home/chat/${chat.id_chat}`,
                            params: {
                                nombre: chat.nombre_usuario,
                                publicacion: chat.nombre_publicacion
                            }
                        })}
                        className="bg-white rounded-2xl p-4 mb-4 shadow-md flex-row items-start"
                    >
                        <Image
                            source={{ uri: `${API_URL}${chat.foto_usuario}` }}
                            className="w-14 h-14 rounded-full mr-4"
                        />
                        <View className="flex-1">
                            <Text className="text-lg text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
                                {chat.nombre_usuario}
                            </Text>
                            <Text className="text-sm text-[#C87F24] mb-1" style={{ fontFamily: "Montserrat" }}>
                                {chat.titulo_publicacion}
                            </Text>
                            <Text
                                className="text-sm text-[#777]"
                                numberOfLines={1}
                                style={{ fontFamily: "MontserratLight" }}
                            >
                                {chat.ultimo_mensaje || "Sin mensajes"}                                                         {chat.fecha_envio ? chat.fecha_envio.split('T')[0] : null}
                            </Text>
                        </View>
                    </Pressable>
                ))
            )}
        </ScrollView>
    )
}
