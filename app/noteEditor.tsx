import { useState, useEffect, useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  Alert,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import EditorOptions from "@/components/EditorOptions";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { insertNote, updateNote, fetchNoteById } from "@/services/noteService";
import EditorHeader from "@/components/EditorHeader";
import { Note } from "@/models/Note";

export default function NoteEditorScreen() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [hasChanged, setHasChanged] = useState(false);

  const params = useLocalSearchParams();
  const noteId = params.noteId ? Number(params.noteId) : null; // Get note ID from route
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [initialNote, setInitialNote] = useState<Note | null>(null);

  const themeTextColor = useThemeColor({}, "text");
  const themeBackgroundColor = useThemeColor({}, "modal");
  const navigation = useNavigation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();


  const handleTitleChange = useCallback((text: string) => {
    setTitle(text);
    setHasChanged(text.trim().length > 0 || body.trim().length > 0);
  }, [body]);
  const handleBodyChange = useCallback((text: string) => {
    setBody(text);
    setHasChanged(title.trim().length > 0 || text.trim().length > 0);
  }, [title]);

  const handleSave = useCallback(async () => {
    if (!title.trim() && !body.trim()) {
      Alert.alert("Empty Note", "Please enter a title or content.");
      return;
    }

    const now = new Date().toISOString();
    
    try {
      if (editingNoteId && initialNote) {
        // Update existing note
        await updateNote({
          ...initialNote,
          title: title.trim(),
          content: body.trim(),
          updatedAt: now,
        });
      } else {
        // Create new note
        await insertNote({
          title: title.trim(),
          content: body.trim(),
          createdAt: now,
          updatedAt: now,
        });
      }
      navigation.goBack();
    } catch {
      Alert.alert("Error", "Failed to save note.");
    }
  }, [title, body, navigation, editingNoteId, initialNote]);
  


  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <EditorHeader
          title="Notes"
          showSave={hasChanged}
          onSave={handleSave}
        />
      ),
    });
  }, [hasChanged, handleSave, navigation]);

  useEffect(() => {
    const loadNote = async () => {
      if (noteId) {
        const note = await fetchNoteById(noteId);
        if (note) {
          setTitle(note.title || "");
          setBody(note.content || "");
          setEditingNoteId(note.id ?? null);
          setInitialNote(note);
        }
      }
    };

    loadNote();
  }, [noteId]);


  

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.editor}>
          <TextInput
            style={[styles.titleInput, { color: themeTextColor }]}
            placeholder="Title"
            value={title}
            onChangeText={handleTitleChange}
            placeholderTextColor="#4e4e4e"
            maxLength={100}
          />
          <TextInput
            style={[styles.bodyInput, { color: themeTextColor }]}
            placeholder="Note something down"
            value={body}
            onChangeText={handleBodyChange}
            placeholderTextColor="#4e4e4e"
            multiline
            textAlignVertical="top"
          />
        </View>

      </KeyboardAvoidingView>

      
      <View style={[
        styles.editorOptions, 
        { 
          backgroundColor: themeBackgroundColor,
          bottom: keyboardHeight
        }
      ]}>
        <EditorOptions keyboardVisible={keyboardHeight > 0} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  keyboardAvoid: {
    flex: 1,
  },
  editor: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 50, 
  },
  titleInput: {
    fontSize: 26,
    fontWeight: "500",
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  bodyInput: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 4,
    paddingBottom: 20,
  },
  editorOptions: {
    position: 'absolute',
    left: 0,
    right: 0,
    minHeight: 50,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});