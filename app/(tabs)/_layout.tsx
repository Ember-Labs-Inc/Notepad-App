import { Tabs } from 'expo-router';
import React from 'react';
import { Image} from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Header from '@/components/Header';
import { LayoutProvider } from '../../contexts/LayoutContext';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <LayoutProvider>
    <Tabs
      screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme].tint,
          headerStyle: {
            backgroundColor: Colors[colorScheme].background,
          },
          header: () => <Header />,
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: Colors[colorScheme].text,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme].background,
            borderColor: Colors[colorScheme].background,
            height: 60,
            paddingTop: 5,
          },
        }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Image
              source={require('@/assets/icons/notes.png')}
              style={{ width: 28, height: 28, tintColor: color }}
          />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          tabBarIcon: ({ color }) => <Image
              source={require('@/assets/icons/schedule.png')}
              style={{ width: 28, height: 28, tintColor: color }}
          />,
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          tabBarIcon: ({ color }) => <Image
              source={require('@/assets/icons/task.png')}
              style={{ width: 28, height: 28, tintColor: color }}
          />,
        }}
      />
      
    </Tabs>
    </LayoutProvider>
  );
}
