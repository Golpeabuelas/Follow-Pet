import { ScrollView, View, Text, Pressable, Image } from "react-native"
import { useRouter } from "expo-router"
import { useFonts } from "expo-font"
import { API_URL } from "../../consts"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState } from "react"

const chatsMock = [
    {
        id: "1",
        nombreUsuario: "Carlos Pérez",
        nombrePublicacion: "Se busca a Luna",
        ultimoMensaje: "¿Tienes más fotos de ella?",
        avatar: `${API_URL}/images/user1.png`
    },
    {
        id: "2",
        nombreUsuario: "Ana Torres",
        nombrePublicacion: "Encontré un gato gris",
        ultimoMensaje: "Sí, me puedes llamar al rato.",
        avatar: `${API_URL}/images/user2.jpg`
    }
]

export default function ChatsScreen() {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
        MontserratLight: require("../../assets/fonts/Montserrat-Light.ttf")
    })

    const [chats, setChats] = useState(chatsMock)

    if (!fontsLoaded) return null

    return (
        <ScrollView style={{ paddingTop: insets.top }} className="flex-1 bg-[#FFF9F0] px-6">
            <Text className="text-2xl font-semibold text-[#5E5E5E] mb-4" style={{ fontFamily: "Montserrat" }}>Tus chats</Text>
            {chats.length === 0 ? (
                <Text className="text-[#888] text-center mt-10" style={{ fontFamily: "Montserrat" }}>No tienes chats activos.</Text>
            ) : (
                chats.map((chat) => (
                <Pressable key={chat.id} onPress={() => router.push({ pathname: `/home/chat/${chat.id}`, params: { nombre: chat.nombreUsuario, publicacion: chat.nombrePublicacion } })} className="bg-white rounded-2xl p-4 mb-4 shadow-md flex-row items-start">
                    <Image source={{ uri: chat.avatar }} className="w-14 h-14 rounded-full mr-4" />
                    <View className="flex-1">
                        <Text className="text-lg text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>{chat.nombreUsuario}</Text>
                        <Text className="text-sm text-[#C87F24] mb-1" style={{ fontFamily: "Montserrat" }}>{chat.nombrePublicacion}</Text>
                        <Text className="text-sm text-[#777]" numberOfLines={1} style={{ fontFamily: "MontserratLight" }}>{chat.ultimoMensaje}</Text>
                    </View>
                </Pressable>
                ))
            )}
        </ScrollView>
    )
}
