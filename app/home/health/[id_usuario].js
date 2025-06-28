import { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Modal
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import LoadingScreen from "../../../components/loadingScreen"
import { API_URL } from "../../../consts"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function ClientDetailsScreen() {
    const { id_usuario } = useLocalSearchParams()
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [client, setClient] = useState(null)
    const [error, setError] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedMascota, setSelectedMascota] = useState(null)

    useEffect(() => {
        const fetchClientDetails = async () => {
            try {
                const res = await fetch(`${API_URL}/get-client-details/${id_usuario}`)
                const data = await res.json()

                if (data.status === 200) {
                    setClient(data.usuario)
                } else {
                    setError(data.error || "No se pudo cargar la información.")
                }
            } catch (err) {
                console.error("Error:", err)
                setError("Error al conectar con el servidor.")
            }
        }

        fetchClientDetails()
    }, [])

    const handleMascotaPress = async (mascota) => {
        try {
            const res = await fetch(`${API_URL}/check-record/${mascota.id_mascota}`)
            const data = await res.json()

            console.log(data)
            if (data.status === 200 && data.exists) {
                router.push(`/home/health/record/${data.id_expediente}`)
            } else {
                setSelectedMascota(mascota)
                setModalVisible(true)
            }
        } catch (err) {
            console.error("Error verificando expediente:", err)
        }
    }

    const handleCrearExpediente = async () => {
        const token = await AsyncStorage.getItem("userToken")
        try {
            const res = await fetch(`${API_URL}/create-record`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                id_mascota: selectedMascota.id_mascota,
                token,
                })
            })
            const data = await res.json()

            if (data.status === 200) {
                setModalVisible(false)
                router.push(`/home/health/record/${data.id_expediente}`)
            }
        } catch (err) {
            console.error("Error creando expediente:", err)
        }
    }

    if (!client && !error) return <LoadingScreen />

    return (
        <ScrollView className="flex-1 bg-[#FFF9F0] px-6" style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }} >
        <Pressable
            onPress={() => router.back()}
            className="mb-4 self-start py-2 px-4 rounded-full bg-[#FFBD59]"
        >
            <Text className="text-[#333] font-bold">Regresar</Text>
        </Pressable>

        {error !== "" ? (
            <Text className="text-center text-red-500">{error}</Text>
        ) : (
            <>
            <View className="items-center mb-6">
                <Image
                source={
                    client.foto_usuario
                    ? { uri: `${API_URL}${client.foto_usuario}` }
                    : require("../../../assets/images/Michi.png")
                }
                className="w-24 h-24 rounded-full mb-3"
                />
                <Text className="text-xl font-bold text-[#444]">{client.nombre_usuario}</Text>
                <Text className="text-sm text-[#666]">{client.correo_usuario}</Text>
            </View>

            <Text className="text-lg font-bold text-[#5E5E5E] mb-3">Mascotas</Text>

            {client.mascotas.length === 0 ? (
                <Text className="text-center text-[#888]">Este cliente aún no tiene mascotas registradas.</Text>
            ) : (
                client.mascotas.map((mascota) => (
                <Pressable
                    key={mascota.id_mascota}
                    onPress={() => handleMascotaPress(mascota)}
                    className="flex-row items-center gap-4 bg-white p-4 rounded-xl shadow mb-4"
                >
                    <Image
                    source={
                        mascota.foto
                        ? { uri: `${API_URL}${mascota.foto}` }
                        : require("../../../assets/images/Michi.png")
                    }
                    className="w-12 h-12 rounded-full"
                    />
                    <View>
                        <Text className="text-base font-bold text-[#444]">{mascota.nombre}</Text>
                        <Text className="text-sm text-[#888]">Edad: {mascota.edad}</Text>
                        <Text className="text-sm text-[#888]">Color: {mascota.color}</Text>
                    </View>
                </Pressable>
                ))
            )}
            </>
        )}

        <Modal visible={modalVisible} transparent animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/40 px-4">
            <View className="bg-white w-full max-w-[90%] rounded-2xl p-6 items-center">
                <Text className="text-lg font-semibold text-[#444] text-center mb-4">
                    Crear expediente para {selectedMascota?.nombre} de {client?.nombre_usuario}?
                </Text>
                <View className="flex-row gap-6">
                <Pressable onPress={() => setModalVisible(false)}>
                    <Text className="text-[#888] font-semibold">Cancelar</Text>
                </Pressable>
                <Pressable onPress={handleCrearExpediente}>
                    <Text className="text-[#D96F3B] font-semibold">Crear</Text>
                </Pressable>
                </View>
            </View>
            </View>
        </Modal>
        </ScrollView>
    )
}
