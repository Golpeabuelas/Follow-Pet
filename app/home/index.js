import { useRouter } from "expo-router"
import { Pressable, View, Text, Image, ScrollView, TextInput, FlatList, KeyboardAvoidingView, Platform } from "react-native"
import { useState, useEffect, useMemo } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useFonts } from "expo-font"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../../consts"
import LoadingScreen from "../../components/loadingScreen"

const filtrosDisponibles = ["Sin filtros", "Reportes", "Perdidos", "Encontrados", "Veterinarios"]

export default function HomeScreen() {
    const router = useRouter()
    const insets = useSafeAreaInsets()
    const [filtroSeleccionado, setFiltroSeleccionado] = useState("Sin filtros")
    const [publicaciones, setPublicaciones] = useState([])
    const [userPhoto, setUserPhoto] = useState(null)

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
    })

    useEffect(() => {
        const cargarPublicaciones = async () => {
            const token = await AsyncStorage.getItem("userToken")

            if (!token) {
                console.error("Token no encontrado, redirigiendo a inicio de sesión")
                return
            }

            try {
                const res = await fetch(`${API_URL}/get-posts-home/${token}`)
                const data = await res.json()
                setPublicaciones(data.publicaciones)
            } catch (err) {
                console.error("Error al cargar publicaciones:", err)
            }

            try {
                const res = await fetch(`${API_URL}/get-user-detail/${token}`)
                const data = await res.json()
                setUserPhoto(data.usuario.foto_usuario)
            } catch (error) {
                console.error("Error al cargar foto de usuario:", error)
            }
        }

        cargarPublicaciones()
    }, [])

    const publicacionesFiltradas = useMemo(() => {
        if (!publicaciones || publicaciones.length === 0) return []

        switch (filtroSeleccionado) {
            case "Sin filtros":
                return publicaciones
            case "Reportes":
                return publicaciones.filter((pub) => pub.id_estatus === 1 || pub.id_estatus === 2)
            case "Perdidos":
                return publicaciones.filter((pub) => pub.id_estatus === 1)
            case "Encontrados":
                return publicaciones.filter((pub) => pub.id_estatus === 2)
            case "Veterinarios":
                return publicaciones.filter((pub) => pub.id_estatus === 3)
            default:
                return publicaciones
        }
    }, [filtroSeleccionado, publicaciones])

    if (!publicaciones.length) {
        return <LoadingScreen />
    }

    if (!fontsLoaded) return null

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-[#FFF9F0]" style={{ paddingTop: insets.top }} >
            <View className="flex-row justify-between items-center px-6 pt-4">
                <Image source={require("../../assets/images/logo.png")} className="w-28 h-28" resizeMode="contain" />
                
                {userPhoto ? (
                <Image source={{ uri: `${API_URL}${userPhoto}` }} className="w-20 h-20 rounded-full" />
                ) : (
                <View className="w-20 h-20 rounded-full bg-gray-300" />
                )}
            </View>

            <View className="px-6 mt-4">
                <TextInput
                placeholder="Buscar..."
                className="border-2 border-black rounded-xl px-4 py-2 bg-white text-[#444]"
                style={{ fontFamily: "Montserrat" }}
                />
            </View>

            <View className="mt-6 px-6">
                <FlatList
                data={filtrosDisponibles}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-3" />}
                renderItem={({ item }) => {
                    const activo = filtroSeleccionado === item

                    return (
                    <Pressable
                        onPress={() => setFiltroSeleccionado(item)}
                        className={`h-8 px-3 py-1 rounded-full justify-center ${
                        activo ? "bg-[#FFBD59]" : "bg-[#444]"
                        }`}
                    >
                        <Text className={`text-s ${activo ? "text-black" : "text-white"}`} style={{ fontFamily: "Montserrat" }} >
                        {item}
                        </Text>
                    </Pressable>
                    )
                }}
                />
            </View>

            <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 250 }}>
                {publicacionesFiltradas.map((pub) => (
                    <Pressable
                        key={pub.id_publicacion}
                        onPress={() => router.push(`/home/detail-post/${pub.id_publicacion}`)}
                        className="bg-white p-4 rounded-2xl mb-4 shadow-md"
                    >
                        {pub.foto_imagen ? (
                            <Image
                                source={{ uri: `${API_URL}${pub.foto_imagen}` }}
                                className="w-full h-40 rounded-xl mb-3 content"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="w-full h-40 rounded-xl mb-3 bg-gray-300" />
                        )}

                        <Text
                            className="text-base font-bold text-[#444]"
                            style={{ fontFamily: "Montserrat" }}
                        >
                            {pub.titulo_publicacion}
                        </Text>

                        <Text
                            className="text-sm text-[#999]"
                            style={{ fontFamily: "Montserrat" }}
                        >
                            {pub.id_estatus === 1
                                ? "Perdido"
                                : pub.id_estatus === 2
                                ? "Encontrado"
                                : pub.id_estatus === 3
                                ? "Clínica veterinaria"
                                : "Otro"}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
