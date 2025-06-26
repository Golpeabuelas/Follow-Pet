import {
    View,
    Text,
    ScrollView,
    Pressable,
    Modal,
    TextInput,
    Dimensions,
    Animated,
} from "react-native"
import { useState, useRef, useEffect } from "react"
import { Calendar } from "react-native-calendars"
import { useFonts } from "expo-font"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MenuIcon } from "lucide-react-native"
import dayjs from "dayjs"
import "dayjs/locale/es"

import DrawerMenu from "../drawer"
import { router } from "expo-router"

const { width } = Dimensions.get("window")

const prioridadColores = {
    0: "#FFE4B5",
    1: "#FFBD59",
    2: "#D96F3B",
}

const linkOptions = [
    {
        label: "Ver clientes",
        onPress: async () => {
            const token = await AsyncStorage.getItem("userToken")
            if (token) router.push("/home/health/see-clients")
            }
    },
    {
        label: "Ver expedientes",
        onPress: async () => {
            const token = await AsyncStorage.getItem("userToken")
            if (token) router.push("/home/health/see-records")
            }
    },
    {
        label: "Agregar cliente",
        onPress: async () => {
            const token = await AsyncStorage.getItem("userToken")
            console.log('me presionan w')
            if (token) router.push("/home/health/add-client")
        }
    },
]

export default function VetHealthScreen() {
    const insets = useSafeAreaInsets()

    const [menuVisible, setMenuVisible] = useState(false)
    const slideAnim = useRef(new Animated.Value(-width * 0.75)).current

    const [selectedDate, setSelectedDate] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [descripcionEvento, setDescripcionEvento] = useState("")
    const [eventos, setEventos] = useState({})
    const [nuevoEvento, setNuevoEvento] = useState("")
    const [prioridadSeleccionada, setPrioridadSeleccionada] = useState(0)

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
    })
    if (!fontsLoaded) return null

    const openModal = (dateStr) => {
        setSelectedDate(dateStr)
        setNuevoEvento(eventos[dateStr]?.title || "")
        setDescripcionEvento(eventos[dateStr]?.description || "")
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
            dotColor: prioridadColores[data.priority],
        }
        return acc
    }, {})

    const openMenu = () => {
        setMenuVisible(true)
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start()
    }

    const closeMenu = () => {
        Animated.timing(slideAnim, {
            toValue: -width * 0.75,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setMenuVisible(false))
    }

    return (
        <>
            <ScrollView className="flex-1 bg-[#FFF9F0] px-6" style={{ paddingTop: insets.top + 30}} contentContainerStyle={{ paddingBottom: 40 }} >
                <View className="flex-row justify-between items-center mt-4 mb-4">
                    <Pressable onPress={openMenu}>
                        <MenuIcon size={28} color="#5E5E5E" />
                    </Pressable>
                    <Text
                        className="text-2xl font-semibold text-[#5E5E5E]"
                        style={{ fontFamily: "Montserrat" }}
                    >
                        Agenda Veterinaria
                    </Text>
                    <View style={{ width: 28 }} />
                </View>

                <Text
                    className="text-xl font-semibold text-[#5E5E5E] mt-5 mb-2"
                    style={{ fontFamily: "Montserrat" }}
                >
                    Calendario de eventos
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

                        <TextInput
                            placeholder="Nombre del evento"
                            value={nuevoEvento}
                            onChangeText={setNuevoEvento}
                            className="border border-[#ccc] rounded-xl px-4 py-2 mb-4 text-[#5E5E5E]"
                            style={{ fontFamily: "Montserrat" }}
                        />

                        <TextInput
                            placeholder="Descripción"
                            value={descripcionEvento}
                            onChangeText={setDescripcionEvento}
                            multiline
                            numberOfLines={3}
                            className="border border-[#ccc] rounded-xl px-4 py-2 mb-4 text-[#5E5E5E]"
                            style={{ fontFamily: "Montserrat", textAlignVertical: "top" }}
                        />

                        <Text
                            className="text-[#5E5E5E] mb-2"
                            style={{ fontFamily: "Montserrat" }}
                        >
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
                                        <Text style={{ fontFamily: "Montserrat" }}>
                                            {etiquetas[p]}
                                        </Text>
                                    </Pressable>
                                )
                            })}
                        </View>

                        <View className="flex-row justify-end gap-6">
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Text className="text-[#888]" style={{ fontFamily: "Montserrat" }}>
                                    Cancelar
                                </Text>
                            </Pressable>
                            <Pressable onPress={guardarEvento}>
                                <Text
                                    className="text-[#D96F3B] font-semibold"
                                    style={{ fontFamily: "Montserrat" }}
                                >
                                    Guardar
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {menuVisible && (
                <DrawerMenu opciones={linkOptions} onCerrar={closeMenu} logoutOption={true} />
            )}
        </>
    )
}
