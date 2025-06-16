import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AddButton from "@/components/ui/AddButton";
import { useFocusEffect, useRouter } from "expo-router";
import {
  NoteCardCard,
  NoteCardGrid,
  NoteCardList,
} from "@/components/NoteCard";
import { useLayout } from "@/contexts/LayoutContext";
import React, { useState } from "react";
import { fetchNotes } from "@/services/noteService";
import { Note } from "@/models/Note";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function HomeScreen() {
  const navigation = useRouter();
  const { layoutMode } = useLayout();
  const [notes, setNotes] = useState<Note[]>([]);
  const bgColor = useThemeColor({}, "background");

  useFocusEffect(
    React.useCallback(() => {
      const loadNotes = async () => {
        const data = await fetchNotes();
        setNotes(data);
      };
      loadNotes();
    }, [])
  );

  const handleNotePress = (note: Note) => {
    navigation.push({
      pathname: "/noteEditor",
      params: { noteId: note.id }, // Pass note ID
    });
  };

  return (
    <>
      <ThemedView style={styles.titlebar}>
        <ThemedText type="title">Notes</ThemedText>
      </ThemedView>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: bgColor },
        ]}
        style={{ flex: 1 }}
      >
        <ThemedView style={styles.container}>
          {notes.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>No notes found</ThemedText>
            </ThemedView>
          ) : layoutMode === "grid" ? (
            <NoteCardGrid
              notes={notes}
              mode="grid"
              onPress={handleNotePress}
              note={notes[0]} // Pass first note to satisfy TS
            />
          ) : layoutMode === "list" ? (
            // Use NoteCardList component directly
            <NoteCardList
              notes={notes}
              mode="list"
              onPress={handleNotePress}
              note={notes[0]}
            />
          ) : (
            // Use NoteCardCard component directly
            <NoteCardCard
              notes={notes}
              mode="card"
              onPress={handleNotePress}
              note={notes[0]}
            />
          )}
        </ThemedView>
      </ScrollView>

      <AddButton
        icon={require("@/assets/icons/plus.png")}
        visible={true}
        onPress={() => navigation.push("/noteEditor")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // leave space for AddButton
  },
  titlebar: {
    width: "100%",
    paddingVertical: 0,
    paddingHorizontal: 15,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    width: "100%",
  },
});
