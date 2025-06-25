import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function ModalMaps({ onLocationSelected }) {
    const [mapOrigin, setMapOrigin] = useState({
        latitude: 19.432611,
        longitude: -99.133194,
    });

    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    };

    const handleSaveLocation = () => {
        if (selectedLocation) {
            onLocationSelected(selectedLocation);
        }
    };

    return (
        <View className="w-[90%] h-[70%] bg-[#E9E9E9] rounded-lg p-4 items-center justify-center">
            <Text className="text-[#788384] text-[20px] mb-4">Selecciona tu ubicación aproximada</Text>
            <MapView
                style={{ width: "100%", height: "80%" }}
                initialRegion={{
                    latitude: mapOrigin.latitude,
                    longitude: mapOrigin.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.04,
                }}
                onPress={handleMapPress}
            >
                {selectedLocation && <Marker coordinate={selectedLocation} />}
            </MapView>

            <Pressable
                className="mt-3 px-4 py-2 bg-[#788384] rounded-md"
                onPress={handleSaveLocation}
            >
                <Text className="text-white text-[16px]">Guardar ubicación</Text>
            </Pressable>
        </View>
    );
}
