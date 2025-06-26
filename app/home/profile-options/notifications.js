import { View, Text, ScrollView, Pressable, Image } from "react-native"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../../../consts"
import LoadingScreen from "../../../components/loadingScreen"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"

export default function NotificationsScreen() {
	const [notifications, setNotifications] = useState(null)
	const [error, setError] = useState("")
	const insets = useSafeAreaInsets()
	const router = useRouter()

	useEffect(() => {
		const fetchNotifications = async () => {
			setError("")
			const token = await AsyncStorage.getItem("userToken")
			try {
				const res = await fetch(`${API_URL}/get-notifications/${token}`)
				const data = await res.json()

				if (data.status === 200) setNotifications(data.notifications)
				else setError(data.error || "Error al cargar notificaciones.")
			} catch (err) {
				console.error("Error al obtener notificaciones:", err)
				setError("Error de red.")
			}
		}

		fetchNotifications()
	}, [])

	const handleMarkAsRead = async (id_notificacion) => {
		try {
			await fetch(`${API_URL}/mark-notification-read`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id_notificacion }),
			})

			setNotifications((prev) =>
				prev.map((noti) =>
					noti.id_notificacion === id_notificacion
						? { ...noti, estado: "leída" }
						: noti
				)
			)
		} catch (err) {
			console.error("Error al marcar como leída:", err)
		}
	}

	const handleConfirm = async (idNotificacion, accepted) => {
        try {
            const token = await AsyncStorage.getItem("userToken")

            const res = await fetch(`${API_URL}/respond-client-request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idNotificacion,
                    aceptado: accepted,
                    token
                })
            })

            const data = await res.json()

            if (data.status === 200) {
                setNotifications((prev) =>
                    prev.map((noti) =>
                        noti.id_notificacion === idNotificacion
                            ? {
                                ...noti,
                                estado: accepted ? "Aceptada" : "Solicitud Rechazada"
                            }
                            : noti
                    )
                )
            } else {
                setError(data.error || "Error al responder la confirmación.")
            }
        } catch (err) {
            console.error("Error al responder confirmación:", err)
            setError("Error de red.")
        }
    }


	if (!notifications) return <LoadingScreen />

	return (
		<ScrollView
			className="flex-1 bg-[#FFF9F0] px-6"
			style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom }}
		>
			<Pressable
				onPress={() => router.back()}
				className="mb-4 self-start py-2 px-4 rounded-full bg-[#FFBD59]"
			>
				<Text className="text-[#333] font-bold">Regresar</Text>
			</Pressable>

			<Text className="text-2xl font-bold text-[#5E5E5E] mb-4">Notificaciones</Text>

			{error !== "" && (
				<Text className="text-red-600 text-center mb-4">{error}</Text>
			)}

			{notifications.length === 0 ? (
				<Text className="text-[#777] text-base text-center">
					No tienes notificaciones.
				</Text>
			) : (
				notifications.map((noti) => (
					<Pressable
						key={noti.id_notificacion}
						onPress={() => handleMarkAsRead(noti.id_notificacion)}
						className="relative mb-4"
					>
						<View className="flex-row items-start bg-white p-4 rounded-xl shadow gap-4">
							<Image
								source={
									noti.mensajero_foto
										? { uri: `${API_URL}${noti.mensajero_foto}` }
										: require("../../../assets/images/Michi.png")
								}
								className="w-12 h-12 rounded-full"
							/>
							<View className="flex-1">
								<Text className="text-base font-bold text-[#444]">
									{noti.descripcion_mensaje}
								</Text>
								<Text className="text-sm text-[#888] mt-1">Estado: {noti.estado}</Text>
								<Text className="text-xs text-[#AAA] mt-1">De: {noti.mensajero_nombre}</Text>

								{noti.estado === "Confirmacion" && (
									<View className="flex-row gap-4 mt-3">
										<Pressable
											className="bg-green-500 rounded-xl py-2 px-4"
											onPress={() => handleConfirm(noti.id_notificacion, true)}
										>
											<Text className="text-white font-semibold">Aceptar</Text>
										</Pressable>
										<Pressable
											className="bg-red-500 rounded-xl py-2 px-4"
											onPress={() => handleConfirm(noti.id_notificacion, false)}
										>
											<Text className="text-white font-semibold">Rechazar</Text>
										</Pressable>
									</View>
								)}

								{noti.estado === "Aceptada" && (
									<Text className="mt-3 text-green-600 font-semibold">
										¡Has aceptado la relación! No necesitas confirmar más.
									</Text>
								)}

								{noti.estado === "Solicitud Aceptada" && (
									<Text className="mt-3 text-green-600 font-semibold">
										Tu solicitud fue aceptada por el cliente.
									</Text>
								)}

								{noti.estado === "Solicitud Rechazada" && (
									<Text className="mt-3 text-red-600 font-semibold">
										El usuario rechazó tu solicitud.
									</Text>
								)}
							</View>
						</View>
						{noti.estado.toLowerCase() === "no leída" && (
							<View
								className="absolute inset-0 bg-blue-300 opacity-25 rounded-xl"
								pointerEvents="none"
							/>
						)}
					</Pressable>
				))
			)}
		</ScrollView>
	)
}
