import { ScrollView, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function TermsScreen({onPress}) {
    const router = useRouter();

    return (
        <View className="flex-1 bg-[#E9E9E9] px-6 pt-12">
            <ScrollView className="mb-6" contentContainerStyle={{ paddingBottom: 250 }}>
                <Text className="text-2xl font-bold text-center mb-4" style={{ fontFamily: "Montserrat" }}>
                Términos y Condiciones
                </Text>

                <Text className="text-base mb-4" style={{ fontFamily: "MontserratLight" }}>
                    AVISO DE PRIVACIDAD
                    En Follow Pet, nos comprometemos a proteger su información personal. Este aviso de
                    privacidad explica cómo recopilamos, usamos y protegemos sus datos personales cuando
                    utiliza nuestro software para reportar mascotas perdidas, consultar reportes y comunicarse
                    con otros usuarios a través del chat.
                    1. Responsable del tratamiento de sus datos personales Follow Pet es el responsable
                    del tratamiento de sus datos personales.
                    2. Datos personales que recopilamos Para el funcionamiento de Follow Pet, podemos
                    recopilar los siguientes datos personales:
                    • Nombre completo.
                    • Correo electrónico.
                    • Datos relacionados con las mascotas.
                    • Ubicación aproximada para los reportes.
                    • Fotografías de las mascotas.
                    • Mensajes enviados a través del chat.
                    No solicitamos datos personales sensibles.
                    3. Finalidades del tratamiento de datos personales Sus datos personales serán
                    utilizados para las siguientes finalidades:
                    • Crear y administrar su cuenta de usuario.
                    • Permitirle reportar mascotas perdidas o encontradas.
                    • Consultar reportes de otras personas.
                    • Facilitar la comunicación directa entre usuarios mediante el chat.
                    • Mejorar la experiencia del usuario y el funcionamiento de la plataforma.
                    4. Transferencia de datos personales No compartiremos sus datos personales con
                    terceros sin su consentimiento expreso, salvo en los casos previstos por la Ley
                    Federal de Protección de Datos Personales en Posesión de los Particulares.
                    5. Ejercicio de derechos ARCO Usted tiene derecho a acceder, rectificar, cancelar u
                    oponerse al tratamiento de sus datos personales (derechos ARCO). Para ejercer
                    estos derechos, por favor contáctenos a través de las redes sociales de la empresa.
                    6. Cambios al aviso de privacidad Cualquier cambio en este aviso de privacidad será
                    notificado a través de la aplicación Follow Pet y actualizado en nuestro sitio web.
                    Le recomendamos revisar periódicamente este aviso de privacidad para estar informado
                    sobre cómo protegemos su información.
                    Fecha de última actualización: 24 de febrero de 2025
                    Para cualquier duda o aclaración sobre este aviso, puede comunicarse con nosotros a
                    través de Follow Pet
                </Text>

                <Pressable onPress={onPress} className="bg-[#788384] rounded-[5px] py-3 mb-4" >
                    <Text className="text-white text-center text-lg" style={{ fontFamily: "Montserrat" }}>
                    Volver
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}
