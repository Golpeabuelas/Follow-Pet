import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, Image, Pressable } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useFonts } from "expo-font"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import { API_URL } from "../../../consts"
import LoadingScreen from "../../../components/loadingScreen"

export default function VetRecordsScreen() {
    const [expedientes, setExpedientes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../../assets/fonts/Montserrat-Regular.ttf"),
    })

    if (!fontsLoaded) return null

    useEffect(() => {
        fetchExpedientes()
    }, [])

    const fetchExpedientes = async () => {
        setLoading(true)
        setError("")
        try {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) throw new Error("No token")

            const res = await fetch(`${API_URL}/get-records-by-vet?token=${token}`)
            const json = await res.json()

            if (json.status === 200) {
                setExpedientes(json.expedientes)
            } else {
                setError(json.error || "Error al cargar expedientes.")
            }
        } catch (err) {
            setError("Error de red.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <LoadingScreen />

    return (
        <ScrollView className="flex-1 bg-[#FFF9F0] px-4" style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom }} >
        <Text className="text-3xl font-extrabold text-center text-[#5E5E5E] mb-5" style={{ fontFamily: "Montserrat" }}>
            Mis Expedientes
        </Text>

        {error ? (
            <Text className="text-center text-red-600 mb-5" style={{ fontFamily: "Montserrat" }}>
                {error}
            </Text>
        ) : expedientes.length === 0 ? (
            <Text className="text-center text-gray-500" style={{ fontFamily: "Montserrat" }}>
                No tienes expedientes asignados.
            </Text>
        ) : (
            expedientes.map((exp) => (
                <Pressable key={exp.id_expediente} onPress={() => router.push(`/home/health/record/${exp.id_expediente}`)} className="flex-row items-center bg-white p-4 rounded-xl mb-4 shadow-md" >
                    <Image source={exp.foto_mascota ? { uri: `${API_URL}${exp.foto_mascota}` } : require("../../../assets/images/Michi.png")} className="w-15 h-15 rounded-full mr-4" style={{ width: 60, height: 60, borderRadius: 30 }} />
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-[#444]" style={{ fontFamily: "Montserrat" }}>
                            {exp.nombre_mascota}
                        </Text>
                        <Text className="text-sm text-gray-600" style={{ fontFamily: "Montserrat" }}>
                            {exp.titulo_publicacion}
                        </Text>
                        <Text className="text-xs text-gray-400" style={{ fontFamily: "Montserrat" }}>
                            Dueño: {exp.nombre_dueño}
                        </Text>
                    </View>
                </Pressable>
            ))
        )}
        </ScrollView>
    )
}
