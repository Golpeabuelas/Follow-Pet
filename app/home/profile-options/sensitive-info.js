import { useState, useEffect } from "react"
import { View, Text, TextInput, Pressable, Modal } from "react-native"
import MapView, { Marker } from "react-native-maps"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../../../consts"
import { Ionicons } from "@expo/vector-icons"

export default function SensitiveSettingsScreen() {
    const [location, setLocation] = useState(null)
    const [markerLocation, setMarkerLocation] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [canEditLocation, setCanEditLocation] = useState(false)
    const [passwordInput, setPasswordInput] = useState("")
    const [isEditable, setIsEditable] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        const token = await AsyncStorage.getItem("userToken")
        const res = await fetch(`${API_URL}/get-profile-details/${token}`)
        const data = await res.json()

        const lat = parseFloat(data.usuario.latitud_ubicacion)
        const lon = parseFloat(data.usuario.longitud_ubicacion)
        setLocation({ latitude: lat, longitude: lon })
        setMarkerLocation({ latitude: lat, longitude: lon })
    }

    const handleMapPress = (e) => {
        if (canEditLocation) {
            setMarkerLocation(e.nativeEvent.coordinate)
        } else {
            setShowModal(true)
        }
    }

    const confirmEnableLocationEdit = () => {
        setCanEditLocation(true)
        setShowModal(false)
    }

    const handleSaveChanges = async () => {
        const token = await AsyncStorage.getItem("userToken")

        try {
            if (canEditLocation) {
                const resLoc = await fetch(`${API_URL}/update-location`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token,
                        latitud: markerLocation.latitude,
                        longitud: markerLocation.longitude,
                    }),
                })
                const dataLoc = await resLoc.json()
                if (dataLoc.status !== 200) throw new Error(dataLoc.message)
                setLocation(markerLocation)
            }

            if (isEditable && passwordInput) {
                const resPass = await fetch(`${API_URL}/update-password`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, nueva: passwordInput }),
                })

                const dataPass = await resPass.json()
                if (dataPass.status !== 200) throw new Error(dataPass.message, "Error al actualizar la contraseña")
            }

            setError("")
            setIsEditable(false)
            setCanEditLocation(false)
            router.push("/home/profile")
        } catch (err) {
            setError(err.message || "Error al guardar cambios")
        }
    }

    return (
        <View className="flex-1 bg-[#FFF9F0] px-6 py-6">
            <Text className="text-2xl font-bold text-[#5E5E5E] mb-6">Información delicada</Text>

            <Text className="text-base text-[#444] mb-2">Ubicación</Text>
            {location && (
                <MapView
                    style={{ height: 250, borderRadius: 16 }}
                    region={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01
                    }}
                    onPress={handleMapPress}
                >
                    {markerLocation && <Marker coordinate={markerLocation} />}
                </MapView>
            )}

            <Modal visible={showModal} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white p-6 rounded-xl w-80">
                        <Text className="text-center text-[#5E5E5E] mb-4">
                            ¿Seguro que deseas activar la edición de ubicación?
                        </Text>
                        <View className="flex-row justify-between">
                            <Pressable
                                onPress={confirmEnableLocationEdit}
                                className="bg-[#FFBD59] px-4 py-2 rounded-xl"
                            >
                                <Text className="text-white font-semibold">Sí</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setShowModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded-xl"
                            >
                                <Text className="text-[#444]">No</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <View className="mt-6">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-base text-[#444]">Contraseña</Text>
                    {!isEditable && (
                        <Pressable onPress={() => setIsEditable(true)}>
                            <Ionicons name="pencil" size={20} color="#FFBD59" />
                        </Pressable>
                    )}
                </View>
                <TextInput
                    secureTextEntry
                    editable={isEditable}
                    value={passwordInput}
                    onChangeText={setPasswordInput}
                    placeholder="Nueva contraseña"
                    className="bg-white rounded-xl px-4 py-3 shadow-sm text-[#444]"
                />
            </View>

            <Pressable
                onPress={handleSaveChanges}
                className="bg-[#FFBD59] py-3 rounded-xl items-center mt-8"
            >
                <Text className="text-white font-semibold text-base">Guardar cambios</Text>
            </Pressable>

            {error !== "" && (
                <Text className="text-red-500 mt-4 text-center">{error}</Text>
            )}
        </View>
    )
}
