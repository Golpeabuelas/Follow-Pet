import { View, Text, ScrollView, Pressable, Image, Modal, Animated, Dimensions } from "react-native"
import { useState, useRef, useEffect } from "react"
import { useFonts } from "expo-font"
import dayjs from "dayjs"
import "dayjs/locale/es"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

import DrawerMenu from "../../components/drawer"
const { width } = Dimensions.get("window")

import { API_URL } from "../../consts"
import { router } from "expo-router"

const STATUS_LABELS = {
    0: "Archivado",
    1: "Perdido",
    2: "Encontrado",
    3: "Clínica",
    5: "Eliminado",
    6: "Archivado",
    7: "Archivado"
}

const STATUS_COLORS = {
    0: "#E6E6E6",  
    1: "#F8D7DA",
    2: "#D1E7FF",
    3: "#FFCA84",
    5: "#FFFFFF",
    6: "#E6E6E6",
    7: "#E6E6E6"
}


const linkOptions = [
    { label: "Crear reporte", onPress: () => router.push('/home/detail-post/create-report')},
    { label: "Administrar reportes", onPress: () => console.log("Administrar reportes") },
]

export default function ReportsScreen() {
    const insets = useSafeAreaInsets()
    const [menuVisible, setMenuVisible] = useState(false)
    const slideAnim = useRef(new Animated.Value(-width * 0.75)).current
    const [fontsLoaded] = useFonts({ Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf") })
    const [publicaciones, setPublicaciones] = useState([])
    const [expandedPubId, setExpandedPubId] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [pubSeleccionada, setPubSeleccionada] = useState(null)
    const [esVeterinario, setEsVeterinario] = useState(false)

    useEffect(() => {
        const cargarDatos = async () => {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) return

            try {
                const resPosts = await fetch(`${API_URL}/get-own-posts/${token}`)
                const dataPosts = await resPosts.json()
                if (dataPosts.status === 200) {
                    setPublicaciones(dataPosts.chats || [])
                } else {
                    setPublicaciones([])
                }

                const resUser = await fetch(`${API_URL}/get-user-detail/${token}`)
                const dataUser = await resUser.json()
                if (dataUser.status === 200 && dataUser.usuario.rol === "Veterinario") {
                    setEsVeterinario(true)
                }
            } catch (error) {
                console.error("Error al cargar datos:", error)
            }
        }

        cargarDatos()
    }, [])

    if (!fontsLoaded) return null

    const toggleExpand = (id) => {
        setExpandedPubId((prev) => (prev === id ? null : id))
    }

    const handleLongPress = (pub) => {
        setPubSeleccionada(pub)
        setModalVisible(true)
    }

    const ocultarPublicacion = async () => {
        if (!pubSeleccionada) return;

        let nuevoEstatus = 0; 

        if (pubSeleccionada.id_estatus === 2) {
            nuevoEstatus = 6;
        } else if (pubSeleccionada.id_estatus === 1) {
            nuevoEstatus = 7; 
        }

        try {
            const res = await fetch(`${API_URL}/update-post-status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_publicacion: pubSeleccionada.id_publicacion,
                    id_estatus: nuevoEstatus,
                }),
            });

            const data = await res.json();

            if (data.status === 200) {
                const actualizadas = publicaciones.map((publicacion) =>
                    publicacion.id === pubSeleccionada.id
                        ? { ...publicacion, status: nuevoEstatus }
                        : publicacion
                );

                setPublicaciones(actualizadas);
                setModalVisible(false);
                if (expandedPubId === pubSeleccionada.id) setExpandedPubId(null);
            } else {
                console.error("Error del servidor:", data.error);
            }
        } catch (error) {
            console.error("Error al ocultar publicación:", error);
        }
    };

    const eliminarPublicacion = async () => {
        if (!pubSeleccionada) return;

        try {
            const res = await fetch(`${API_URL}/update-post-status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_publicacion: pubSeleccionada.id_publicacion,
                    id_estatus: 5, 
                }),
            });

            const data = await res.json();

            if (data.status === 200) {
                const actualizadas = publicaciones.map((p) =>
                    p.id === pubSeleccionada.id
                        ? { ...p, status: 5 }
                        : p
                );

                setPublicaciones(actualizadas);
                setModalVisible(false);
                if (expandedPubId === pubSeleccionada.id) setExpandedPubId(null);
            } else {
                console.error("Error del servidor:", data.error);
            }
        } catch (error) {
            console.error("Error al eliminar publicación:", error);
        }
    };

    const desarchivarPublicacion = async () => {
        if (!pubSeleccionada) return;

        let nuevoEstatus = null;

        if (pubSeleccionada.id_estatus === 6) {
            nuevoEstatus = 2;
        } else if (pubSeleccionada.id_estatus === 7) {
            nuevoEstatus = 1; 
        } else if (pubSeleccionada.id_estatus === 0) {
            nuevoEstatus = 3
        } else {
            console.warn("No se puede desarchivar: la publicación no está en estado archivado.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/update-post-status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_publicacion: pubSeleccionada.id_publicacion,
                    id_estatus: nuevoEstatus,
                }),
            });

            const data = await res.json();

            if (data.status === 200) {
                const actualizadas = publicaciones.map((p) =>
                    p.id === pubSeleccionada.id
                        ? { ...p, status: nuevoEstatus }
                        : p
                );

                setPublicaciones(actualizadas);
                setModalVisible(false);
                if (expandedPubId === pubSeleccionada.id) setExpandedPubId(null);
            } else {
                console.error("Error del servidor:", data.error);
            }
        } catch (error) {
            console.error("Error al desarchivar publicación:", error);
        }
    };

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

    const opciones = [...linkOptions]
    if (esVeterinario) {
        opciones.push({
            label: "Promocionar mi clínica",
            onPress: () => router.push('/home/detail-post/promote-clinic')
        })
    }

    const visibles = publicaciones.filter((p) => p.status !== 5)

    return (
        <View className="flex-1 bg-[#FFF9F0]" style={{ paddingTop: insets.top }}>
        {menuVisible && (
            <DrawerMenu opciones={opciones} onCerrar={closeMenu}/>
        )}

        <ScrollView className="flex-1 bg-[#FFF9F0] px-6 pt-4" contentContainerStyle={{ paddingBottom: 40 }} >
            <View className="px-6 pt-4 mb-7 flex-row items-center justify-between">
            <Pressable onPress={openMenu}>
                <Ionicons name="menu" size={28} color="#5E5E5E" />
            </Pressable>

            <Text className="text-xl font-semibold text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
                Tus publicaciones
            </Text>
            <View style={{ width: 28 }} />
            </View>

            {visibles.length === 0 ? (
                <Text className="text-[#888] text-center mt-10" style={{ fontFamily: "Montserrat" }}>
                    No tienes publicaciones visibles.
                </Text>
            ) : (
                visibles.map((pub) => {
                    const isExpanded = pub.id_publicacion === expandedPubId
                    const relatedChats = pub.chats || []

                    return (
                        <View key={pub.id_publicacion} className="mb-6">
                            <Pressable
                                onPress={() => toggleExpand(pub.id_publicacion)}
                                onLongPress={() => handleLongPress(pub)}
                                delayLongPress={800}
                                className="bg-white rounded-2xl p-4 shadow-md flex-row items-center"
                            >
                                {pub.foto_mascota && (
                                    <Image source={{ uri: `${API_URL}${pub.foto_mascota}` }} className="w-16 h-16 rounded-full mr-4" />
                                )}
                                <View className="flex-1">
                                    <Text className="text-lg text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
                                        {pub.titulo_publicacion}
                                    </Text>

                                    <Text className="text-xs px-2 py-0.5 mt-1 rounded-full w-fit" style={{ backgroundColor: STATUS_COLORS[pub.id_estatus], fontFamily: "Montserrat" }}>
                                        {STATUS_LABELS[pub.id_estatus]}
                                    </Text>
                                </View>
                            </Pressable>

                            {isExpanded && (
                                <View className="bg-white rounded-b-2xl px-4 py-3 mt-1 shadow-inner border border-t-0 border-gray-300">
                                    {relatedChats.length === 0 ? (
                                    <Text className="text-[#999]" style={{ fontFamily: "Montserrat" }}>
                                        No hay chats para esta publicación.
                                    </Text>
                                    ) : (
                                    relatedChats.map((chat) => (
                                        <View key={chat.id_chat} className="border-b border-gray-200 py-2 last:border-0">
                                        <Text className="font-semibold text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
                                            {chat.usuario_receptor.nombre_usuario}
                                        </Text>

                                        <Text
                                            className="text-sm text-[#777]"
                                            numberOfLines={1}
                                            style={{ fontFamily: "Montserrat" }}
                                        >
                                            {chat.ultimo_mensaje || "Sin mensajes"}
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
                <Text className="text-lg text-center font-semibold text-[#5E5E5E] mb-6" style={{ fontFamily: "Montserrat" }} >
                    {pubSeleccionada?.id_estatus === 6 || pubSeleccionada?.id_estatus === 7
                    ? "¿Deseas desarchivar esta publicación?"
                    : "¿Qué deseas hacer con esta publicación?"}
                </Text>

                {(pubSeleccionada?.id_estatus === 6 || pubSeleccionada?.id_estatus === 7 || pubSeleccionada?.id_estatus === 0) ? (

                    <>
                        <Pressable className="bg-[#D1E7FF] rounded-xl px-4 py-3 mb-4" onPress={desarchivarPublicacion}>
                            <Text className="text-center text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
                                Desarchivar publicación
                            </Text>
                        </Pressable>

                        <Pressable className="bg-[#F8D7DA] rounded-xl px-4 py-3" onPress={eliminarPublicacion}>
                            <Text className="text-center text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
                                Eliminar publicación definitivamente
                            </Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Pressable className="bg-[#FFF3CD] rounded-xl px-4 py-3 mb-4" onPress={ocultarPublicacion}>
                            <Text className="text-center text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
                                Ocultar publicación a las demás personas
                            </Text>
                        </Pressable>
                        <Pressable className="bg-[#F8D7DA] rounded-xl px-4 py-3" onPress={eliminarPublicacion}>
                            <Text className="text-center text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
                                Eliminar publicación definitivamente
                            </Text>
                        </Pressable>
                    </>
                )}

                <Pressable onPress={() => setModalVisible(false)} className="mt-4">
                    <Text className="text-center text-[#999]" style={{ fontFamily: "Montserrat" }}>
                    Cancelar
                    </Text>
                </Pressable>
                </View>
            </View>
            </Modal>
        </View>
    )
}
