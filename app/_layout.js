import { Stack } from 'expo-router';
import "../global.css"

export default function StackLayout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="setx" options={{ headerShown: false }} />
    </Stack>
  );
}
