import { useState } from "react"
import { View, Text, TextInput, Pressable, ScrollView, Image, Modal, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as ImagePicker from "expo-image-picker"
import MapView, { Marker } from "react-native-maps"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL, uploadImages } from "../../../consts"
import { CameraIcon, UbiIcon } from "../../../components/icons"
import { useRouter } from "expo-router"

const height = Dimensions.get('window').height

export default function PromoteClinicScreen() {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [titulo, setTitulo] = useState("")
    const [telefono, setTelefono] = useState("")
    const [servicios, setServicios] = useState("")
    const [web, setWeb] = useState("")
    const [imagen, setImagen] = useState(null)
    const [latLng, setLatLng] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [error, setError] = useState("")

    const openImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1
        })
        if (!result.canceled) setImagen(result.assets[0].uri)
    }

    const handleOnlyNumbers = (text) => text.replace(/[^0-9]/g, "")

    const handleSubmit = async () => {
        setError("")
        const token = await AsyncStorage.getItem("userToken")
        if (!token) return setError("Usuario no autenticado.")

        if (!titulo || !telefono || !servicios) return setError("Llena todos los campos obligatorios.")
        if (!imagen) return setError("Selecciona una imagen.")
        if (!latLng) return setError("Selecciona una ubicación.")

        const imagenUrl = await uploadImages(imagen)

        const body = {
            token,
            titulo,
            telefono,
            servicios,
            enlace: web,
            imagen: imagenUrl,
            latitud: latLng.latitude,
            longitud: latLng.longitude
        }

        try {
            const res = await fetch(`${API_URL}/create-clinic-promotion`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            const data = await res.json()
            if (data.status === 200) router.back()
            else setError(data.error || "Error al crear publicación.")
        } catch (err) {
            setError("Error de red.")
            console.error(err)
        }
    }

    return (
        <ScrollView
            className="flex-1 bg-[#FFF9F0] px-6 pt-6"
            contentContainerStyle={{
                paddingTop: insets.top + 20,
                paddingBottom: insets.bottom + 150,
                minHeight: height + 100
            }}
        >
            <Text className="text-2xl font-bold text-[#5E5E5E] mb-4">Promocionar clínica</Text>

            <TextInput placeholder="Nombre de la clínica" value={titulo} onChangeText={setTitulo}
                className="bg-white p-3 rounded-xl mb-4" />
            <TextInput placeholder="Teléfono" value={telefono} onChangeText={(t) => setTelefono(handleOnlyNumbers(t))}
                keyboardType="numeric" className="bg-white p-3 rounded-xl mb-4" />
            <TextInput placeholder="Servicios ofrecidos" value={servicios} onChangeText={setServicios} multiline
                className="bg-white p-3 rounded-xl mb-4 min-h-[100px]" />
            <TextInput placeholder="Enlace web (opcional)" value={web} onChangeText={setWeb}
                className="bg-white p-3 rounded-xl mb-4" />

            <View className="w-full aspect-square rounded-xl border border-[#DDD] overflow-hidden items-center justify-center bg-white mb-4">
                {imagen
                    ? <Image source={{ uri: imagen }} className="w-full h-full" resizeMode="cover" />
                    : <Text className="text-[#AAA] text-center">Sin imagen</Text>}
            </View>

            <View className="flex-row justify-center gap-12 mb-6">
                <Pressable onPress={() => setModalVisible(true)} className="items-center justify-center">
                    <UbiIcon size={64} color="#AAAAAA" />
                </Pressable>
                <Pressable onPress={openImagePicker} className="items-center justify-center">
                    <CameraIcon size={64} color="#AAAAAA" />
                </Pressable>
            </View>

            {error !== "" && (
                <Text className="text-red-600 text-center mb-4">{error}</Text>
            )}

            <Pressable onPress={handleSubmit} className="bg-[#FFBD59] py-3 rounded-xl mb-10">
                <Text className="text-center text-[#333] text-base font-bold">Publicar promoción</Text>
            </Pressable>

            <Modal animationType="slide" transparent={false} visible={modalVisible}>
                <View className="flex-1">
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude: 19.4326,
                            longitude: -99.1332,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05
                        }}
                        onPress={(e) => setLatLng(e.nativeEvent.coordinate)}
                    >
                        {latLng && <Marker coordinate={latLng} />}
                    </MapView>

                    <Pressable
                        onPress={() => setModalVisible(false)}
                        className="absolute bottom-10 left-6 right-6 bg-white py-3 rounded-xl border border-black"
                    >
                        <Text className="text-center text-black text-base font-bold">
                            Confirmar ubicación
                        </Text>
                    </Pressable>
                </View>
            </Modal>
        </ScrollView>
    )
}
