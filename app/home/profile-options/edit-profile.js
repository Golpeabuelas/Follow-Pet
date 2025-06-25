import { View, Text, TextInput, Pressable, Image, ActivityIndicator } from "react-native"
import { useState, useEffect } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons"
import { API_URL, uploadImages } from "../../../consts"

export default function EditProfileScreen() {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [fotoUri, setFotoUri] = useState(null)
    const [fotoPreview, setFotoPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        loadProfileData()
    }, [])

    const loadProfileData = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken")
            const res = await fetch(`${API_URL}/get-profile-details/${token}`)
            const data = await res.json()

            setNombre(data.usuario.nombre_usuario || "")
            setCorreo(data.usuario.correo_usuario || "")
            setFotoPreview(`${API_URL}${data.usuario.foto_usuario}`)
        } catch (error) {
            console.error("Error al cargar datos del perfil", error)
        }
    }

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        })

        if (!result.canceled) {
            setFotoUri(result.assets[0].uri)
            setFotoPreview(result.assets[0].uri)
        }
    }

    const handleSave = async () => {
        setErrorMessage("")
        setLoading(true)

        try {
            const token = await AsyncStorage.getItem("userToken")
            let rutaFinal = fotoPreview

            if (fotoUri) {
                const ruta = await uploadImages(fotoPreview)
                if (!ruta) {
                    setErrorMessage("No se pudo subir la imagen.")
                    setLoading(false)
                    return
                }
                rutaFinal = ruta
            }

            const response = await fetch(`${API_URL}/update-profile/${token}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: nombre,
                    foto: rutaFinal,
                }),
            })

            const data = await response.json()

            switch (data.status) {
                case 200:
                    router.back()
                    break
                case 400:
                case 409:
                case 401:
                    setErrorMessage(data.message)
                    break
                default:
                    setErrorMessage("Ocurrió un error inesperado.")
            }
        } catch (error) {
            console.error("Error al actualizar el perfil:", error)
            setErrorMessage("No se pudo actualizar el perfil.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <View className="flex-1 bg-[#FFF9F0] px-6 pt-10" style={{ paddingTop: insets.top, paddingBottom: 20 }}>
            <Pressable onPress={() => router.back()} className="z-10 mb-4">
                <Ionicons name="arrow-back" size={28} color="#5E5E5E" />
            </Pressable>

            <Text className="text-2xl font-bold text-[#5E5E5E] text-center mb-6">Editar Perfil</Text>

            {/* Contenedor de error */}
            {errorMessage !== "" && (
                <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl mb-4">
                    <Text className="text-red-700 text-center">{errorMessage}</Text>
                </View>
            )}

            {/* Imagen */}
            <Pressable onPress={pickImage} className="items-center mb-6">
                {fotoPreview ? (
                    <Image source={{ uri: fotoPreview }} className="w-32 h-32 rounded-full border-4 border-[#FFBD59]" />
                ) : (
                    <View className="w-32 h-32 rounded-full bg-gray-300" />
                )}
                <Text className="text-sm text-[#FFBD59] mt-2">Cambiar foto</Text>
            </Pressable>

            {/* Campos */}
            <View className="space-y-4">
                <View>
                    <Text className="text-[#5E5E5E] mb-1">Nombre</Text>
                    <TextInput
                        className="bg-white rounded-xl px-4 py-3 shadow-sm text-[#444]"
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="Tu nombre"
                    />
                </View>

                <View>
                    <Text className="text-[#5E5E5E] mb-1">Correo</Text>
                    <Text className="bg-white rounded-xl px-4 py-3 shadow-sm text-[#444]">
                        {correo}
                    </Text>
                </View>
            </View>

            {/* Guardar */}
            <Pressable
                onPress={handleSave}
                className="bg-[#FFBD59] py-3 rounded-xl items-center mt-8"
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white font-semibold text-base">Guardar cambios</Text>
                )}
            </Pressable>
        </View>
    )
}
