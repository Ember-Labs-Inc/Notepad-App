import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function TaskScreen() {
  return (
    <>
      <ThemedView style={styles.titlebar}>
        <ThemedText type="title">Tasks</ThemedText>
      </ThemedView>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Task Screen</ThemedText>
        <ThemedText type="default">
          This is a placeholder for the Task screen.
        </ThemedText>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titlebar: {
    width: "100%",
    paddingVertical: 0,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
});
