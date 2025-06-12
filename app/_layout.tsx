import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import SimpleHeader from "@/components/SimpleHeader";
import EditorHeader from "@/components/EditorHeader";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useEffect } from "react";
import { initDB } from "@/db/init";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    initDB();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
    >
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: true,
              header: () => <SimpleHeader title="Settings" />,
            }}
          />
          <Stack.Screen
            name="noteEditor"
            options={{
              headerShown: true,
              header: () => <EditorHeader title="Notes" />,
            }}
          />
          <Stack.Screen
            name="scheduleEditor"
            options={{
              headerShown: true,
              header: () => <EditorHeader title="Schedule" />,
            }}
          />
          <Stack.Screen
            name="taskEditor"
            options={{
              headerShown: true,
              header: () => <EditorHeader title="Task" />,
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaView>
  );
}
