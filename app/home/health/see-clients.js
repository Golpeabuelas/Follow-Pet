import { View, Text, ScrollView, Image, Pressable } from "react-native"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useFonts } from "expo-font"
import { API_URL } from "../../../consts"
import LoadingScreen from "../../../components/loadingScreen"
import { useRouter } from "expo-router"

export default function ClientsScreen() {
    const [clients, setClients] = useState(null)
    const [error, setError] = useState("")
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../../assets/fonts/Montserrat-Regular.ttf"),
    })
    if (!fontsLoaded) return null

    useEffect(() => {
        const fetchClients = async () => {
            setError("")
            const token = await AsyncStorage.getItem("userToken")
            try {
                const res = await fetch(`${API_URL}/get-vet-clients/${token}`)
                const data = await res.json()

                if (data.status === 200) setClients(data.clients)
                else setError(data.error || "No se pudieron cargar los clientes.")
            } catch (err) {
                console.error("Error al obtener clientes:", err)
                setError("Error de red.")
            }
        }

        fetchClients()
    }, [])

    if (!clients) return <LoadingScreen />

    return (
        <ScrollView className="flex-1 bg-[#FFF9F0] px-6" style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom }}>
            <Pressable onPress={() => router.back()} className="mb-4 self-start py-2 px-4 rounded-full bg-[#FFBD59]" >
                <Text className="text-[#333] font-bold">Regresar</Text>
            </Pressable>

            <Text className="text-2xl font-bold text-[#5E5E5E] mb-4" style={{ fontFamily: "Montserrat" }}>
                Mis Clientes
            </Text>

            {error !== "" && (
                <Text className="text-red-600 text-center mb-4">{error}</Text>
            )}

            {clients.length === 0 ? (
                <Text className="text-[#777] text-base text-center">Aún no tienes clientes vinculados.</Text>
                ) : (
                clients.map((client) => (
                    <Pressable key={client.id_usuario} onPress={() => router.push(`/home/health/${client.id_usuario}`)} className="flex-row items-center gap-4 bg-white p-4 rounded-xl shadow mb-4" >
                        <Image
                            source={
                            client.foto_usuario
                                ? { uri: `${API_URL}${client.foto_usuario}` }
                                : require("../../../assets/images/Michi.png")
                            }
                            className="w-12 h-12 rounded-full"
                        />
                        <View className="flex-1">
                            <Text className="text-base font-bold text-[#444]" style={{ fontFamily: "Montserrat" }}>
                            {client.nombre_usuario}
                            </Text>
                            <Text className="text-sm text-[#888]" style={{ fontFamily: "Montserrat" }}>
                            {client.correo_usuario}
                            </Text>
                        </View>
                    </Pressable>
                ))
            )}
        </ScrollView>
    )
}
