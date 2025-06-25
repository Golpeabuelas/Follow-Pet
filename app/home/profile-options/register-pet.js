import { useState } from "react"
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    Image,
    Alert,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL, uploadImages } from "../../../consts"
import { useRouter } from "expo-router"

export default function AddPetScreen() {
    const [nombre, setNombre] = useState("")
    const [edad, setEdad] = useState("")
    const [color, setColor] = useState("")
    const [foto, setFoto] = useState(null)
    const [error, setError] = useState("")
    const router = useRouter()

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        })

        if (!result.canceled) {
            setFoto(result.assets[0])
        }
    }

    const handleAddPet = async () => {
        const token = await AsyncStorage.getItem("userToken")
        if (!nombre || !edad || !color || !foto) {
            setError("Todos los campos son obligatorios.")
            return
        }

        try {
            const rutaImagen = await uploadImages(foto.uri)
            if (!rutaImagen) throw new Error("No se pudo subir la imagen")

            const res = await fetch(`${API_URL}/add-pet`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    nombre,
                    edad,
                    color,
                    foto: rutaImagen,
                }),
            })

            const data = await res.json()
            if (data.status !== 200) throw new Error(data.message)

            setError("")
            Alert.alert("Éxito", "Mascota añadida correctamente")
            router.back()
        } catch (err) {
            setError(err.message || "Error al añadir la mascota")
        }
    }

    return (
        <View className="flex-1 bg-[#FFF9F0] relative">
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <Text className="text-2xl font-bold text-[#5E5E5E] mb-6">Añadir mascota</Text>

                <View className="items-center mb-4">
                    {foto ? (
                        <Image
                            source={{ uri: foto.uri }}
                            style={{
                                width: 180,
                                height: 180,
                                borderRadius: 90,
                                borderWidth: 3,
                                borderColor: "#FFBD59",
                            }}
                        />
                    ) : (
                        <View
                            style={{
                                width: 180,
                                height: 180,
                                borderRadius: 90,
                                backgroundColor: "#E5E5E5",
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: 2,
                                borderColor: "#ccc",
                            }}
                        >
                            <Text style={{ color: "#888" }}>Sin imagen</Text>
                        </View>
                    )}

                    <Pressable
                        onPress={pickImage}
                        className="bg-[#FFBD59] px-4 py-2 mt-3 rounded-xl"
                    >
                        <Text className="text-white font-semibold">Seleccionar imagen</Text>
                    </Pressable>
                </View>

                <TextInput
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Nombre de la mascota"
                    className="bg-white rounded-xl px-4 py-3 mb-3 shadow-sm text-[#444]"
                />
                <TextInput
                    value={edad}
                    onChangeText={setEdad}
                    placeholder="Edad"
                    className="bg-white rounded-xl px-4 py-3 mb-3 shadow-sm text-[#444]"
                />
                <TextInput
                    value={color}
                    onChangeText={setColor}
                    placeholder="Color"
                    className="bg-white rounded-xl px-4 py-3 mb-3 shadow-sm text-[#444]"
                />

                <Pressable
                    onPress={handleAddPet}
                    className="bg-[#FFBD59] py-3 rounded-xl items-center mt-4"
                >
                    <Text className="text-white font-semibold text-base">Guardar mascota</Text>
                </Pressable>

                {error !== "" && (
                    <Text className="text-red-500 mt-4 text-center">{error}</Text>
                )}
            </ScrollView>
        </View>
    )
}
