import { View, Text, ScrollView, Pressable, Image, Modal, Animated, Dimensions} from "react-native"
import { useState, useRef } from "react"
import { useFonts } from "expo-font"
import dayjs from "dayjs"
import 'dayjs/locale/es'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

import DrawerMenu from "../../components/drawer"
const { width } = Dimensions.get("window")

import { API_URL } from "../../consts"

//------------------------------------MOCK DATA------------------------------------
const STATUS_LABELS = { 1: "Perdido", 2: "Encontrado", 5: "Oculto" }
const STATUS_COLORS = { 1: "#F8D7DA", 2: "#D1E7FF", 5: "#FFF3CD" }

const publicacionesIniciales = [
  { id: "1", nombre: "Milo", fecha: "2025-06-20", status: 1, imagen: `${API_URL}/images/Thomas.jpg` },
  { id: "2", nombre: "Luna", fecha: "2025-06-15", status: 2, imagen: `${API_URL}/images/Michi.png` }
]

const chatsMock = {
  "1": [
    { id: "c1", nombreUsuario: "Carlos Pérez", ultimoMensaje: "¿Tienes más fotos?" },
    { id: "c2", nombreUsuario: "Ana Torres", ultimoMensaje: "Estoy cerca de tu zona." }
  ],
  "2": [
    { id: "c3", nombreUsuario: "Luis Gómez", ultimoMensaje: "¿Dónde lo encontraste exactamente?" }
  ]
}

//------------------------------------MOCK DATA------------------------------------

const linkOptions = [
    { label: "Crear reporte", onPress: () => console.log("Crear reporte") },
    { label: "Administrar reportes", onPress: () => console.log("Administrar reportes") },
]


export default function ReportsScreen() {
    const insets = useSafeAreaInsets()
    const [menuVisible, setMenuVisible] = useState(false)
    const slideAnim = useRef(new Animated.Value(-width * 0.75)).current
    const [fontsLoaded] = useFonts({ Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf") })
    const [publicaciones, setPublicaciones] = useState(publicacionesIniciales)
    const [expandedPubId, setExpandedPubId] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [pubSeleccionada, setPubSeleccionada] = useState(null)

    if (!fontsLoaded) return null

    const toggleExpand = (id) => {
        setExpandedPubId(prev => (prev === id ? null : id))
    }

    const handleLongPress = (pub) => {
        setPubSeleccionada(pub)
        setModalVisible(true)
    }

    const ocultarPublicacion = () => {
        const actualizadas = publicaciones.map((publicacion) => publicacion.id === pubSeleccionada.id ? { ...publicacion, status: 5 } : publicacion)
        setPublicaciones(actualizadas)
        setModalVisible(false)
        if (expandedPubId === pubSeleccionada.id) setExpandedPubId(null)
    }

    const eliminarPublicacion = () => {
        const actualizadas = publicaciones.map((p) => p.id === pubSeleccionada.id ? { ...p, status: 0 } : p)
        setPublicaciones(actualizadas)
        setModalVisible(false)
        if (expandedPubId === pubSeleccionada.id) setExpandedPubId(null)
    }

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

    const filtradas = publicaciones.filter((p) => p.status !== 0)

    return (
        <View className="flex-1 bg-[#FFF9F0]" style={{ paddingTop: insets.top }}>
            {menuVisible && (
                <DrawerMenu opciones={linkOptions} onCerrar={closeMenu} >
                        <Pressable className="mt-auto" onPress={() => console.log("Cerrar sesión")}>
                            <Text className="text-base font-bold text-red-500" style={{ fontFamily: "Montserrat" }} >
                                Cerrar sesión
                            </Text>
                        </Pressable>
                </DrawerMenu>
            )}
            
            <ScrollView className="flex-1 bg-[#FFF9F0] px-6 pt-4" contentContainerStyle={{ paddingBottom: 40 }}> 
                <View className="px-6 pt-4 mb-7 flex-row items-center justify-between">
                    <Pressable onPress={openMenu}>
                        <Ionicons name="menu" size={28} color="#5E5E5E" />
                    </Pressable>
                    
                    <Text className="text-xl font-semibold text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
                        Tus reportes
                    </Text>
                    <View style={{ width: 28 }} /> 
                </View>
                
                {filtradas.length === 0 ? 
                (
                    <Text className="text-[#888] text-center mt-10" style={{ fontFamily: "Montserrat" }}>
                        No tienes publicaciones visibles.
                    </Text>
                ) : 
                (
                    filtradas.map((pub) => {
                        const isExpanded = pub.id === expandedPubId
                        const relatedChats = chatsMock[pub.id] || []

                        return (
                            <View key={pub.id} className="mb-6">
                                <Pressable onPress={() => toggleExpand(pub.id)} onLongPress={() => handleLongPress(pub)} delayLongPress={800} className="bg-white rounded-2xl p-4 shadow-md flex-row items-center">
                                    {pub.imagen && (
                                        <Image source={{ uri: pub.imagen }} className="w-16 h-16 rounded-full mr-4" />
                                    )}
                                    <View className="flex-1">
                                        <Text className="text-lg text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
                                            {pub.nombre}
                                        </Text>

                                        <Text className="text-sm text-[#999]" style={{ fontFamily: "Montserrat" }}>
                                            {dayjs(pub.fecha).locale("es").format("DD/MM/YYYY")}
                                        </Text>

                                        <Text className="text-xs px-2 py-0.5 mt-1 rounded-full w-fit" style={{ backgroundColor: STATUS_COLORS[pub.status], fontFamily: "Montserrat" }}>
                                            {STATUS_LABELS[pub.status]}
                                        </Text>
                                    </View>
                                </Pressable>

                                {isExpanded && (
                                    <View className="bg-white rounded-b-2xl px-4 py-3 mt-1 shadow-inner border border-t-0 border-gray-300">
                                        {relatedChats.length === 0 ? (
                                                <Text className="text-[#999]" style={{ fontFamily: "Montserrat" }}>
                                                    No hay chats para esta publicación.
                                                </Text>
                                            ) : 
                                            (
                                            relatedChats.map((chat) => (
                                                <View key={chat.id} className="border-b border-gray-200 py-2 last:border-0">
                                                    <Text className="font-semibold text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
                                                        {chat.nombreUsuario}
                                                    </Text>

                                                    <Text className="text-sm text-[#777]" numberOfLines={1} style={{ fontFamily: "Montserrat" }}>
                                                        {chat.ultimoMensaje}
                                                    </Text>
                                                </View>
                                            ))
                                        )}
                                    </View>
                                )}
                            </View>
                        )
                    })
                )}
            </ScrollView>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/40 px-4">
                <View className="bg-white w-full rounded-2xl p-6">
                    <Text className="text-lg text-center font-semibold text-[#5E5E5E] mb-6" style={{ fontFamily: "Montserrat" }}>¿Qué deseas hacer con esta publicación?</Text>
                    <Pressable className="bg-[#FFF3CD] rounded-xl px-4 py-3 mb-4" onPress={ocultarPublicacion}>
                    <Text className="text-center text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>Ocultar publicación a las demás personas</Text>
                    </Pressable>
                    <Pressable className="bg-[#F8D7DA] rounded-xl px-4 py-3" onPress={eliminarPublicacion}>
                    <Text className="text-center text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>Eliminar publicación definitivamente</Text>
                    </Pressable>
                    <Pressable onPress={() => setModalVisible(false)} className="mt-4">
                    <Text className="text-center text-[#999]" style={{ fontFamily: "Montserrat" }}>Cancelar</Text>
                    </Pressable>
                </View>
                </View>
            </Modal>
        </View>
    )
}
