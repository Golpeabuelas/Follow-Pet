import { View, Text, ScrollView, Image, Modal, TextInput, Pressable } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { API_URL } from "../../../../consts"
import LoadingScreen from "../../../../components/loadingScreen"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useFonts } from "expo-font"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function RecordDetailsScreen() {
    const { id_expediente } = useLocalSearchParams()
    const [data, setData] = useState(null)
    const [error, setError] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [tituloSeguimiento, setTituloSeguimiento] = useState("")
    const [descripcionSeguimiento, setDescripcionSeguimiento] = useState("")
    const [prioridadSeleccionada, setPrioridadSeleccionada] = useState(1) // valor por defecto
    const [loadingSeguimiento, setLoadingSeguimiento] = useState(false)

    const insets = useSafeAreaInsets()

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../../../assets/fonts/Montserrat-Regular.ttf"),
    })
    if (!fontsLoaded) return null

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_URL}/get-record-details/${id_expediente}`)
            const json = await res.json()
            
            if (json.status === 200) setData(json.expediente)
            else setError(json.error || "Error al cargar el expediente.")
        } catch (err) {
            console.error("Error al cargar:", err)
            setError("Error de red.")
        }
    }

    const handleGuardarSeguimiento = async () => {
        const token = await AsyncStorage.getItem("userToken")
        
        if (!token) return
        if (!tituloSeguimiento.trim() || !descripcionSeguimiento.trim()) return

        setLoadingSeguimiento(true)

        try {
            const res = await fetch(`${API_URL}/add-follow-up`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_expediente: id_expediente,
                    id_estatus: prioridadSeleccionada,
                    titulo_seguimiento: tituloSeguimiento,
                    seguimiento: descripcionSeguimiento,
                    token
                })
            })

            const data = await res.json()
            if (data.status === 200) {
                setModalVisible(false)
                setTituloSeguimiento("")
                setDescripcionSeguimiento("")
                setPrioridadSeleccionada(1)
                fetchData()
            }
        } catch (error) {
            console.error("Error al guardar seguimiento:", error)
        } finally {
            setLoadingSeguimiento(false)
        }
    }


    if (!data) return <LoadingScreen />

    return (
        <ScrollView className="flex-1 bg-[#FFF9F0] px-6" style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom }} >
            {error !== "" && (
                <Text className="text-red-600 text-center mb-4" style={{ fontFamily: "Montserrat" }}>
                {error}
                </Text>
            )}

            <Text className="text-2xl font-bold text-[#5E5E5E] mb-4" style={{ fontFamily: "Montserrat" }}>
                {data.titulo_publicacion}
            </Text>

            <View className="bg-white p-4 rounded-xl shadow mb-6">
                <Image
                    source={data.foto_mascota ? { uri: `${API_URL}${data.foto_mascota}` } : require("../../../../assets/images/Michi.png")}
                    className="w-20 h-20 rounded-full mb-3"
                />
                <Text className="text-lg font-bold text-[#444]" style={{ fontFamily: "Montserrat" }}>
                    Mascota: {data.nombre_mascota}
                </Text>
                <Text className="text-base text-[#666]" style={{ fontFamily: "Montserrat" }}>
                    Edad: {data.edad_mascota}
                </Text>
                <Text className="text-base text-[#666]" style={{ fontFamily: "Montserrat" }}>
                    Color: {data.color_mascota}
                </Text>
            </View>

            <View className="bg-white p-4 rounded-xl shadow mb-6">
                <Image
                    source={data.foto_dueño ? { uri: `${API_URL}${data.foto_dueño}` } : require("../../../../assets/images/Michi.png")}
                    className="w-12 h-12 rounded-full mb-2"
                />
                <Text className="text-lg font-bold text-[#444]" style={{ fontFamily: "Montserrat" }}>
                    Dueño: {data.nombre_dueño}
                </Text>
                <Text className="text-base text-[#666]" style={{ fontFamily: "Montserrat" }}>
                    Correo: {data.correo_dueño}
                </Text>
            </View>

            <Text className="text-xl font-bold text-[#5E5E5E] mb-2" style={{ fontFamily: "Montserrat" }}>
                Seguimientos
            </Text>

            {data.seguimientos.length === 0 ? (
                <Text className="text-[#777] text-base text-center" style={{ fontFamily: "Montserrat" }}>
                    No hay seguimientos registrados.
                </Text>
            ) : (
                data.seguimientos.map((s) => (
                    <View key={s.id_seguimiento} className="bg-white p-4 rounded-xl shadow mb-4" >
                        <Text className="text-base font-bold text-[#444]" style={{ fontFamily: "Montserrat" }}>
                            {s.titulo}
                        </Text>
                        <Text className="text-sm text-[#666] mt-1" style={{ fontFamily: "Montserrat" }}>
                            {s.detalle}
                        </Text>
                        <Text className="text-xs text-[#AAA] mt-2" style={{ fontFamily: "Montserrat" }}>
                            Prioridad: {s.estatus}
                        </Text>
                    </View>
                ))
            )}

            <Pressable
                onPress={() => setModalVisible(true)}
                className="self-end mt-10 mb-4 px-4 py-2 rounded-xl bg-[#FFBD59]"
            >
                <Text className="text-[#333] font-medium" style={{ fontFamily: "Montserrat" }}>
                    Agregar seguimiento
                </Text>
            </Pressable>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/40 px-4">
                    <View className="bg-white w-full max-h-[90%] rounded-2xl p-6">
                        <Text className="text-xl font-semibold text-[#5E5E5E] mb-4 text-center" style={{ fontFamily: "Montserrat" }}>
                            Nuevo seguimiento
                        </Text>

                        <TextInput
                            placeholder="Título del seguimiento"
                            value={tituloSeguimiento}
                            onChangeText={setTituloSeguimiento}
                            className="border border-[#ccc] rounded-xl px-4 py-2 mb-4 text-[#5E5E5E]"
                            style={{ fontFamily: "Montserrat" }}
                        />

                        <TextInput
                            placeholder="Descripción del seguimiento"
                            value={descripcionSeguimiento}
                            onChangeText={setDescripcionSeguimiento}
                            multiline
                            numberOfLines={3}
                            className="border border-[#ccc] rounded-xl px-4 py-2 mb-4 text-[#5E5E5E]"
                            style={{ fontFamily: "Montserrat", textAlignVertical: "top" }}
                        />

                        <Text className="text-[#5E5E5E] mb-2" style={{ fontFamily: "Montserrat" }}>
                            Nivel de prioridad
                        </Text>

                        <View className="flex-row justify-between mb-6">
                            {[1, 2, 3].map((p) => {
                                const colores = {
                                    1: "#D1E7DD",
                                    2: "#FFF3CD",
                                    3: "#F8D7DA"
                                }
                                const etiquetas = {
                                    1: "Baja",
                                    2: "Prioritario",
                                    3: "Urgente"
                                }

                                return (
                                    <Pressable
                                        key={p}
                                        onPress={() => setPrioridadSeleccionada(p)}
                                        className={`w-[30%] h-10 rounded-xl items-center justify-center border ${
                                            prioridadSeleccionada === p ? "border-[#5E5E5E]" : "border-transparent"
                                        }`}
                                        style={{ backgroundColor: colores[p] }}
                                    >
                                        <Text style={{ fontFamily: "Montserrat" }}>{etiquetas[p]}</Text>
                                    </Pressable>
                                )
                            })}
                        </View>

                        <View className="flex-row justify-end gap-6">
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Text className="text-[#888]" style={{ fontFamily: "Montserrat" }}>Cancelar</Text>
                            </Pressable>

                            <Pressable onPress={handleGuardarSeguimiento}>
                                <Text className="text-[#D96F3B] font-semibold" style={{ fontFamily: "Montserrat" }}>
                                    {loadingSeguimiento ? "Guardando..." : "Guardar"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}
