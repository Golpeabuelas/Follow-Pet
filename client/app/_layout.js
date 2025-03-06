/*import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from "expo-router";

export default function startTabs() {
    return (
        <Tabs>
            <Tabs.Screen
                name="sign_up"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color="black" />,
                }}
            />
            <Tabs.Screen
                name="sign_in"
                options={{
                    title: 'Mafufo',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <AntDesign name="setting" size={24} color="black" />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Prueba',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <AntDesign name="setting" size={24} color="black" />,
                }}
            />
        </Tabs>    
    )
}*/

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
        <Stack.Screen
            name="sign_up"
            options={{ title: 'HOME'}}
        />
        <Stack.Screen
            name="sign_index"
            options={{ title: 'Perromomos'}}
        />
    </Stack>
  );
}

