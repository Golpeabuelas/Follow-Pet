import { useLocalSearchParams, useRouter } from "expo-router"
import { View, Text, Image, ScrollView, Pressable, Modal } from "react-native"
import { useEffect, useState } from "react"
import { useFonts } from "expo-font"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import MapView, { Marker } from "react-native-maps"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { API_URL } from "../../../consts"
import LoadingScreen from "../../../components/loadingScreen"

export default function DetailPost() {
    const { id_publicacion } = useLocalSearchParams()
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [publicacion, setPublicacion] = useState(null)
    const [showMap, setShowMap] = useState(false)

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../../assets/fonts/Montserrat-Regular.ttf"),
        MontserratLight: require("../../../assets/fonts/Montserrat-Light.ttf"),
    })

    useEffect(() => {
        const cargarPublicacion = async () => {
            try {
                const res = await fetch(`${API_URL}/get-post-details/${id_publicacion}`)
                const data = await res.json()
                setPublicacion(data.publicacion)
            } catch (err) {
                console.error(err)
            }
        }

        cargarPublicacion()
    }, [id_publicacion])

    const handleChatPress = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) return

            const res = await fetch(`${API_URL}/create-chat-from-post`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, id_publicacion })
            })

            const data = await res.json()

            if (data.status === 400) {
                alert("No puedes chatear contigo mismo")
                return
            }

            if (data.id_chat) router.push(`/home/chat/${data.id_chat}`)
            else alert("No se pudo crear el chat")
        } catch (err) {
            console.error("Error al iniciar chat:", err)
        }
    }

    if (!publicacion || !fontsLoaded) return <LoadingScreen />

    const esMascota = publicacion.id_estatus === 1 || publicacion.id_estatus === 2
    const esVeterinaria = publicacion.id_estatus === 3

    return (
        <ScrollView className="flex-1 bg-[#FFF9F0] px-6" style={{ paddingTop: insets.top }}>
            <View className="bg-white rounded-2xl shadow-md p-6 mt-6 mx-auto w-full max-w-[500px]">
                <Image
                    source={{
                        uri: `${API_URL}${esMascota ? publicacion.foto_mascota : publicacion.foto_clinica || "/images/default.png"}`
                    }}
                    className="w-full h-60 rounded-2xl mb-4"
                    resizeMode="cover"
                />

                <Text className="text-2xl font-bold text-[#333] mb-2" style={{ fontFamily: "Montserrat" }}>
                    {publicacion.titulo_publicacion}
                </Text>

                <Text className="text-base text-[#777] mb-4" style={{ fontFamily: "Montserrat" }}>
                    Tipo: {publicacion.estatus}
                </Text>

                {esMascota && (
                    <>
                        <View className="mb-4 space-y-1">
                            <Text className="text-base text-[#444]" style={{ fontFamily: "Montserrat" }}>
                                Nombre: {publicacion.nombre_mascota}
                            </Text>
                            <Text className="text-base text-[#444]" style={{ fontFamily: "Montserrat" }}>
                                Edad: {publicacion.edad_mascota}
                            </Text>
                            <Text className="text-base text-[#444]" style={{ fontFamily: "Montserrat" }}>
                                Color: {publicacion.color_mascota}
                            </Text>
                            <Text className="text-base text-[#444]" style={{ fontFamily: "Montserrat" }}>
                                Distintivo: {publicacion.distintivo_mascota}
                            </Text>
                        </View>

                        {publicacion.descripcion_desaparicion && (
                            <View className="mb-4 space-y-1">
                                <Text className="text-base text-[#444]" style={{ fontFamily: "Montserrat" }}>
                                    Descripción: {publicacion.descripcion_desaparicion}
                                </Text>
                                <Text className="text-base text-[#444]" style={{ fontFamily: "Montserrat" }}>
                                    Fecha de desaparición: {publicacion.fecha_desaparicion.split('T')[0]}
                                </Text>
                            </View>
                        )}
                    </>
                )}

                {esVeterinaria && (
                    <>
                        <Text className="text-base text-[#444] mb-2" style={{ fontFamily: "Montserrat" }}>
                            Teléfono: {publicacion.telefono_clinica}
                        </Text>
                        <Text className="text-base text-[#444] mb-2" style={{ fontFamily: "Montserrat" }}>
                            Servicios: {publicacion.servicios_clinica}
                        </Text>
                        {publicacion.enlace_web && (
                            <Text className="text-base text-[#444] mb-4" style={{ fontFamily: "Montserrat" }}>
                                Sitio web: {publicacion.enlace_web}
                            </Text>
                        )}
                    </>
                )}

                {(publicacion.latitud_ubicacion && publicacion.longitud_ubicacion) && (
                    <Pressable onPress={() => setShowMap(true)} className="bg-[#444] py-3 rounded-xl mt-2">
                        <Text className="text-center text-white text-base font-bold" style={{ fontFamily: "Montserrat" }}>
                            Ver ubicación
                        </Text>
                    </Pressable>
                )}

                {(publicacion.id_estatus === 1 || publicacion.id_estatus === 2 || publicacion.id_estatus === 3) && (
                    <Pressable onPress={handleChatPress} className="bg-[#FFBD59] py-3 rounded-xl mt-4">
                        <Text className="text-center text-black text-base font-bold" style={{ fontFamily: "Montserrat" }}>
                            {publicacion.id_estatus === 3 ? "Chatear con veterinario" : "Chatear con dueño"}
                        </Text>
                    </Pressable>
                )}

            </View>

            {showMap && (
                <Modal animationType="slide" transparent={false} visible={showMap}>
                    <View className="flex-1">
                        <MapView
                            style={{ flex: 1 }}
                            initialRegion={{
                                latitude: parseFloat(publicacion.latitud_ubicacion),
                                longitude: parseFloat(publicacion.longitud_ubicacion),
                                latitudeDelta: 1,
                                longitudeDelta: 1,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: parseFloat(publicacion.latitud_ubicacion),
                                    longitude: parseFloat(publicacion.longitud_ubicacion),
                                }}
                                title="Ubicación"
                            />
                        </MapView>

                        <Pressable
                            onPress={() => setShowMap(false)}
                            className="absolute bottom-10 left-6 right-6 bg-white py-3 rounded-xl border border-black"
                        >
                            <Text className="text-center text-black text-base font-bold" style={{ fontFamily: "Montserrat" }}>
                                Cerrar mapa
                            </Text>
                        </Pressable>
                    </View>
                </Modal>
            )}
        </ScrollView>
    )
}
