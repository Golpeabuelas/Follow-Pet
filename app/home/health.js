import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TextInput,
  Dimensions,
} from "react-native"
import { useState } from "react"
import { Calendar } from "react-native-calendars"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useFonts } from "expo-font"
import dayjs from "dayjs"
import 'dayjs/locale/es'

const { width } = Dimensions.get("window")

const mascotas = [
  { id: "1", nombre: "Thomas", imagen: "https://placekitten.com/200/200" },
  { id: "2", nombre: "Michi", imagen: "https://placekitten.com/201/201" },
]

const prioridadColores = {
  0: "#FFE4B5", // no urgente
  1: "#FFBD59", // necesario
  2: "#D96F3B", // urgente
}

export default function HealthScreen() {
    const insets = useSafeAreaInsets()
    const [selectedDate, setSelectedDate] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [descripcionEvento, setDescripcionEvento] = useState("")
    const [eventos, setEventos] = useState({
        "2025-06-20": { title: "Vacuna anual", priority: 1 },
        "2025-06-23": { title: "Revisión dental", priority: 0 },
    })
    const [nuevoEvento, setNuevoEvento] = useState("")
    const [prioridadSeleccionada, setPrioridadSeleccionada] = useState(0)

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
        MontserratLight: require("../../assets/fonts/Montserrat-Light.ttf"),
    })

    if (!fontsLoaded) return null

    const openModal = (dateStr) => {
        setSelectedDate(dateStr)
        setNuevoEvento(eventos[dateStr]?.title || "")
        setPrioridadSeleccionada(eventos[dateStr]?.priority ?? 0)
        setModalVisible(true)
    }

    const guardarEvento = () => {
        setEventos({
            ...eventos,
            [selectedDate]: {
            title: nuevoEvento,
            description: descripcionEvento,
            priority: prioridadSeleccionada,
            },
        })
        setModalVisible(false)
        setNuevoEvento("")
        setDescripcionEvento("")
    }


    const markedDates = Object.entries(eventos).reduce((acc, [date, data]) => {
        acc[date] = {
        marked: true,
        dotColor: data ? prioridadColores[data.priority] : "#ccc",
        }
        return acc
    }, {})

    return (
        <>
            <ScrollView
                className="flex-1 bg-[#FFF9F0] px-6"
                style={{ paddingTop: insets.top }}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <Text
                className="text-2xl font-semibold text-[#5E5E5E] mt-6 mb-4"
                style={{ fontFamily: "Montserrat" }}
                >
                Expedientes de salud
                </Text>

                {mascotas.map((m) => (
                <Pressable
                    key={m.id}
                    onPress={() => console.log("Abrir expediente de", m.nombre)}
                    className="flex-row bg-white rounded-2xl items-center p-4 mb-4 shadow-md"
                >
                    <Image source={{ uri: m.imagen }} className="w-16 h-16 rounded-full mr-4" />
                    <Text
                    className="text-lg text-[#5E5E5E]"
                    style={{ fontFamily: "Montserrat" }}
                    >
                    {m.nombre}
                    </Text>
                </Pressable>
                ))}

                <Text
                className="text-xl font-semibold text-[#5E5E5E] mt-6 mb-2"
                style={{ fontFamily: "Montserrat" }}
                >
                Eventos del veterinario
                </Text>

                <View className="rounded-2xl overflow-hidden border border-[#E9E9E9]">
                <Calendar
                    onDayPress={(day) => openModal(day.dateString)}
                    markedDates={markedDates}
                    theme={{
                    backgroundColor: "#FFF9F0",
                    calendarBackground: "#FFF9F0",
                    textSectionTitleColor: "#5E5E5E",
                    selectedDayBackgroundColor: "#FFBD59",
                    selectedDayTextColor: "#fff",
                    todayTextColor: "#FFBD59",
                    dayTextColor: "#5E5E5E",
                    textDisabledColor: "#ccc",
                    dotColor: "#FFBD59",
                    arrowColor: "#FFBD59",
                    monthTextColor: "#5E5E5E",
                    textDayFontFamily: "Montserrat",
                    textMonthFontFamily: "Montserrat",
                    textDayHeaderFontFamily: "Montserrat",
                    }}
                />
                </View>
            </ScrollView>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/40 px-4">
                    <View className="bg-white w-full max-h-[90%] rounded-2xl p-6">
                    <Text
                        className="text-xl font-semibold text-[#5E5E5E] mb-4 text-center"
                        style={{ fontFamily: "Montserrat" }}
                    >
                        {dayjs(selectedDate).locale("es").format("dddd, DD [de] MMMM")}
                    </Text>

                    <Text className="text-[#5E5E5E] mb-1" style={{ fontFamily: "Montserrat" }}>
                        Nombre del evento
                    </Text>
                    <TextInput
                        className="border border-[#ccc] rounded-xl px-4 py-2 mb-4 text-[#5E5E5E]"
                        placeholder="Ej: Vacunación anual"
                        value={nuevoEvento}
                        onChangeText={setNuevoEvento}
                        style={{ fontFamily: "Montserrat" }}
                    />

                    <Text className="text-[#5E5E5E] mb-1" style={{ fontFamily: "Montserrat" }}>
                        Descripción del evento
                    </Text>
                    <TextInput
                        className="border border-[#ccc] rounded-xl px-4 py-2 mb-4 text-[#5E5E5E]"
                        placeholder="Escribe detalles aquí..."
                        value={descripcionEvento}
                        onChangeText={setDescripcionEvento}
                        multiline
                        numberOfLines={3}
                        style={{ fontFamily: "Montserrat", textAlignVertical: "top" }}
                    />

                    <Text className="text-[#5E5E5E] mb-2" style={{ fontFamily: "Montserrat" }}>
                        Prioridad
                    </Text>
                    <View className="flex-row justify-between mb-6">
                        {[0, 1, 2].map((p) => {
                        const colores = {
                            0: "#D1E7DD",
                            1: "#FFF3CD",
                            2: "#F8D7DA",
                        }
                        const etiquetas = ["Baja", "Media", "Alta"]
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
                        <Pressable onPress={guardarEvento}>
                        <Text className="text-[#D96F3B] font-semibold" style={{ fontFamily: "Montserrat" }}>
                            Guardar
                        </Text>
                        </Pressable>
                    </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}
