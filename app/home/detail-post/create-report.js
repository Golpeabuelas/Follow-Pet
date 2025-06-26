import { View, Text, TextInput, Pressable, Modal, ScrollView, Image, Platform } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import { API_URL, uploadImages } from "../../../consts"
import { CameraIcon, UbiIcon } from "../../../components/icons"
import * as ImagePicker from "expo-image-picker"
import MapView, { Marker } from "react-native-maps"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import DateTimePicker from "@react-native-community/datetimepicker"

export default function CreateReportScreen() {
    const [titulo, setTitulo] = useState("")
    const [nombre, setNombre] = useState("")
    const [edad, setEdad] = useState("")
    const [color, setColor] = useState("")
    const [distintivo, setDistintivo] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [fecha, setFecha] = useState(null)
    const [showDate, setShowDate] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [image, setImage] = useState(null)
    const [latLng, setLatLng] = useState(null)
    const [tipo, setTipo] = useState("perdido")
    const [error, setError] = useState("")

    const router = useRouter()
    const insets = useSafeAreaInsets()

    const openImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1
        })
        if (!result.canceled) setImage(result.assets[0].uri)
    }

    const handleCrearReporte = async () => {
        setError("")
        const token = await AsyncStorage.getItem("userToken")
        if (!token) return setError("Usuario no autenticado.")
        if (!titulo || !nombre || !edad || !color || !distintivo || !descripcion || !fecha)
            return setError("Todos los campos son obligatorios.")
        if (!image) return setError("Selecciona una imagen.")
        if (!latLng) return setError("Selecciona una ubicación.")

        const imagenUrl = await uploadImages(image)

        const body = {
            token,
            titulo,
            nombre,
            edad,
            color,
            distintivo,
            descripcion,
            fecha: fecha.toISOString().split("T")[0],
            latitud: latLng.latitude,
            longitud: latLng.longitude,
            imagen: imagenUrl,
            id_estatus: tipo == "perdido" ? 1 : 2
        }

        try {
            const res = await fetch(`${API_URL}/crear-reporte`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            const data = await res.json()
            if (data.status === 200) router.back()
            else setError(data.error || "Error al crear reporte.")
        } catch (err) {
            setError("Error de red al crear reporte.")
            console.error(err)
        }
    }

    const handleOnlyLetters = (text) => text.replace(/[^a-zA-ZÁÉÍÓÚÑáéíóúñ\s]/g, "")
    const handleOnlyNumbers = (text) => text.replace(/[^0-9]/g, "")

    return (
        <ScrollView className="flex-1 bg-[#FFF9F0] px-6 pt-6" style={{ paddingTop: insets.top }}>
            <View className="flex-row justify-between">
                <View className="w-[48%]">
                    <TextInput placeholder="Título" value={titulo} onChangeText={setTitulo}
                        className="bg-white p-3 rounded-xl mb-4" />
                    <TextInput placeholder="Nombre" value={nombre} onChangeText={(text) => setNombre(handleOnlyLetters(text))}
                        className="bg-white p-3 rounded-xl mb-4" />
                    <TextInput placeholder="Edad" value={edad} onChangeText={(text) => setEdad(handleOnlyNumbers(text))}
                        keyboardType="numeric" className="bg-white p-3 rounded-xl mb-4" />
                    <TextInput placeholder="Color" value={color} onChangeText={(text) => setColor(handleOnlyLetters(text))}
                        className="bg-white p-3 rounded-xl mb-4" />
                </View>

                <View className="w-[48%] aspect-square rounded-xl border border-[#DDD] overflow-hidden items-center justify-center bg-white">
                    {image
                        ? <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                        : <Text className="text-[#AAA] text-center">Sin imagen</Text>}
                </View>
            </View>

            <TextInput placeholder="Distintivo" value={distintivo} onChangeText={(text) => setDistintivo(handleOnlyLetters(text))}
                className="bg-white p-3 rounded-xl mb-4" />
            <TextInput placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} multiline
                className="bg-white p-3 rounded-xl mb-4 min-h-[100px]" />

            <Pressable onPress={() => setShowDate(true)} className="bg-white p-3 rounded-xl mb-4">
                <Text className="text-[#333]">
                    {fecha ? fecha.toLocaleDateString() : "Selecciona una fecha"}
                </Text>
            </Pressable>

            {showDate && (
                <DateTimePicker
                    value={fecha || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    maximumDate={new Date()}
                    minimumDate={new Date(2000, 0, 1)}
                    onChange={(_, selectedDate) => {
                        setShowDate(false)
                        if (!selectedDate) return;

                        const hoy = new Date();
                        hoy.setHours(0, 0, 0, 0);

                        const minFecha = new Date(2000, 0, 1);

                        const seleccion = new Date(selectedDate);
                        seleccion.setHours(0, 0, 0, 0);

                        if (seleccion > hoy) {
                            setError("La fecha no puede ser en el futuro.");
                            setFecha(null);
                        } else if (seleccion < minFecha) {
                            setError("La fecha no puede ser anterior al año 2000.");
                            setFecha(null);
                        } else {
                            setError("");
                            setFecha(seleccion);
                        }
                    }}
                />
            )}

            <View className="flex-row justify-between px-[25%] mb-4">
                <Pressable onPress={() => setModalVisible(true)} className="items-center justify-center">
                    <UbiIcon size={64} color="#AAAAAA" />
                </Pressable>
                <Pressable onPress={openImagePicker} className="items-center justify-center">
                    <CameraIcon size={64} color="#AAAAAA" />
                </Pressable>
            </View>

            <View className="flex-row justify-center gap-4 mb-6">
                <Pressable
                    className={`px-6 py-2 rounded-full border ${tipo === "perdido" ? "bg-[#FFBD59] border-[#FFBD59]" : "border-[#CCC]"}`}
                    onPress={() => setTipo("perdido")}>
                    <Text className="text-[#333] font-bold">Perdido</Text>
                </Pressable>
                <Pressable
                    className={`px-6 py-2 rounded-full border ${tipo === "encontrado" ? "bg-[#FFBD59] border-[#FFBD59]" : "border-[#CCC]"}`}
                    onPress={() => setTipo("encontrado")}>
                    <Text className="text-[#333] font-bold">Encontrado</Text>
                </Pressable>
            </View>

            {error !== "" && (
                <Text className="text-red-600 text-center mb-4">{error}</Text>
            )}

            <Pressable onPress={handleCrearReporte} className="bg-[#FFBD59] py-3 rounded-xl mb-10">
                <Text className="text-center text-[#333] text-base font-bold">Crear reporte</Text>
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
