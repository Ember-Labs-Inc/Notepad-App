import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import type { Note } from "@/models/Note";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

type NoteCardProps = {
  note: Note;
  notes: Note[];
  mode: "list" | "card" | "grid";
  onPress?: (note: Note) => void;
};

// Format date as dd/mm
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
};

const groupNotesByDate = (notes: Note[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const groups: { [label: string]: Note[] } = {};

  // First sort all notes by most recent activity
  const sortedNotes = [...notes].sort((a, b) => {
    const aDate = new Date(a.updatedAt || a.createdAt);
    const bDate = new Date(b.updatedAt || b.createdAt);
    return bDate.getTime() - aDate.getTime(); // Descending order
  });

  sortedNotes.forEach((note) => {
    const activityDate = new Date(note.updatedAt || note.createdAt);
    const dateOnly = new Date(
      activityDate.getFullYear(),
      activityDate.getMonth(),
      activityDate.getDate()
    );

    let key = "";
    if (dateOnly >= today) {
      key = "Today";
    } else if (dateOnly >= yesterday) {
      key = "Yesterday";
    } else if (dateOnly >= sevenDaysAgo) {
      // Show day name for notes between 2-7 days old
      key = activityDate.toLocaleString("default", { weekday: "long" });
    } else {
      const year = activityDate.getFullYear();
      const currentYear = now.getFullYear();
      key =
        activityDate.toLocaleString("default", { month: "long" }) +
        (year !== currentYear ? ` ${year}` : "");
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(note);
  });

  return groups;
};

// List style
const ListNoteCard: React.FC<NoteCardProps & { isLast?: boolean }> = ({
  note,
  onPress,
  isLast,
}) => {
  const textColor = useThemeColor({}, "text");

  return (
    <>
      <TouchableOpacity
        style={[styles.list]}
        onPress={() => onPress?.(note)}
        activeOpacity={0.8}
      >
        <Text
          style={[styles.listTitle, { color: textColor }]}
          numberOfLines={1}
        >
          {note.title}
        </Text>
        <View style={styles.row}>
          {note.createdAt && (
            <Text style={[styles.listDate, { color: textColor }]}>
              {formatDate(note.createdAt)}
            </Text>
          )}
          <View style={styles.dot} />
          <Text
            style={[styles.listContent, { color: textColor }]}
            numberOfLines={1}
          >
            {note.content?.slice(0, 40)}
            {note.content.length > 40 ? "…" : ""}
          </Text>
        </View>
      </TouchableOpacity>
      {!isLast && <View style={styles.listDivider} />}
    </>
  );
};

// Card style
const CardNoteCard: React.FC<NoteCardProps> = ({ note, onPress }) => {
  const bgColor = useThemeColor({}, "defaultNote");
  const textColor = useThemeColor({}, "text");

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor }]}
      onPress={() => onPress?.(note)}
      activeOpacity={0.8}
    >
      {note.createdAt && (
        <Text style={[styles.cardDate, { color: textColor }]}>
          {formatDate(note.createdAt)}
        </Text>
      )}
      <Text style={[styles.cardTitle, { color: textColor }]} numberOfLines={1}>
        {note.title}
      </Text>
      <Text
        style={[styles.cardContent, { color: textColor }]}
        numberOfLines={2}
      >
        {note.content?.slice(0, 100)}
        {note.content.length > 100 ? "…" : ""}
      </Text>
    </TouchableOpacity>
  );
};

// Grid style
const GridNoteCard: React.FC<NoteCardProps> = ({ note, onPress }) => {
  const bgColor = useThemeColor({}, "defaultNote");
  const textColor = useThemeColor({}, "text");

  return (
    <TouchableOpacity
      style={[styles.grid, { backgroundColor: bgColor }]}
      onPress={() => onPress?.(note)}
      activeOpacity={0.8}
    >
      <Text style={[styles.gridTitle, { color: textColor }]} numberOfLines={1}>
        {note.title}
      </Text>
      <Text
        style={[styles.gridContent, { color: textColor }]}
        numberOfLines={3}
      >
        {note.content?.slice(0, 60)}
        {note.content.length > 60 ? "…" : ""}
      </Text>
      {note.createdAt && (
        <Text style={[styles.gridDate, { color: textColor }]}>
          {formatDate(note.createdAt)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const NoteCardCard: React.FC<NoteCardProps> = ({ notes, onPress }) => {
  const grouped = groupNotesByDate(notes);
  const textColor = useThemeColor({}, "text");

  // Get sorted group keys in desired order
  const groupKeys = Object.keys(grouped).sort((a, b) => {
    const order = ["Today", "Yesterday", "Previous 7 Days"];
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);

    // Prioritize predefined groups
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // Sort other groups chronologically
    const aDate = new Date(grouped[a][0].updatedAt || grouped[a][0].createdAt);
    const bDate = new Date(grouped[b][0].updatedAt || grouped[b][0].createdAt);
    return bDate.getTime() - aDate.getTime();
  });

  return (
    <>
      {groupKeys.map((label) => (
        <React.Fragment key={label}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionHeader, { color: textColor }]}
          >
            {label}
          </ThemedText>
          <ThemedView style={styles.cardBase}>
            {grouped[label].map((note) => (
              <CardNoteCard
                key={note.id}
                note={note}
                notes={[note]}
                onPress={() => onPress?.(note)}
                mode="card"
              />
            ))}
          </ThemedView>
        </React.Fragment>
      ))}
    </>
  );
};

export const NoteCardList: React.FC<NoteCardProps> = ({ notes, onPress }) => {
  const grouped = groupNotesByDate(notes);
  const textColor = useThemeColor({}, "text");
  const defaultCard = useThemeColor({}, "defaultNote");

  // Get sorted group keys in desired order
  const groupKeys = Object.keys(grouped).sort((a, b) => {
    const order = ["Today", "Yesterday", "Previous 7 Days"];
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);

    // Prioritize predefined groups
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // Sort other groups chronologically
    const aDate = new Date(grouped[a][0].updatedAt || grouped[a][0].createdAt);
    const bDate = new Date(grouped[b][0].updatedAt || grouped[b][0].createdAt);
    return bDate.getTime() - aDate.getTime();
  });

  return (
    <>
      {groupKeys.map((label) => (
        <React.Fragment key={label}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionHeader, { color: textColor }]}
          >
            {label}
          </ThemedText>
          <ThemedView
            style={[styles.listBase, { backgroundColor: defaultCard }]}
          >
            {grouped[label].map((note, idx, arr) => (
              <ListNoteCard
                key={note.id}
                note={note}
                notes={[note]}
                onPress={onPress}
                mode="list"
                isLast={idx === arr.length - 1}
              />
            ))}
          </ThemedView>
        </React.Fragment>
      ))}
    </>
  );
};

// Grid Group Component
export const NoteCardGrid: React.FC<NoteCardProps> = ({ notes, onPress }) => {
  const grouped = groupNotesByDate(notes);
  const textColor = useThemeColor({}, "text");

  // Get sorted group keys in desired order
  const groupKeys = Object.keys(grouped).sort((a, b) => {
    const order = ["Today", "Yesterday", "Previous 7 Days"];
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);

    // Prioritize predefined groups
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // Sort other groups chronologically
    const aDate = new Date(grouped[a][0].updatedAt || grouped[a][0].createdAt);
    const bDate = new Date(grouped[b][0].updatedAt || grouped[b][0].createdAt);
    return bDate.getTime() - aDate.getTime();
  });

  return (
    <>
      {groupKeys.map((label) => (
        <React.Fragment key={label}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionHeader, { color: textColor }]}
          >
            {label}
          </ThemedText>
          <ThemedView style={styles.gridBase}>
            {grouped[label].map((note) => (
              <GridNoteCard
                key={note.id}
                note={note}
                notes={[note]}
                onPress={() => onPress?.(note)}
                mode="grid"
              />
            ))}
          </ThemedView>
        </React.Fragment>
      ))}
    </>
  );
};

// Main NoteCard dispatcher
const NoteCard: React.FC<NoteCardProps> = (props) => {
  switch (props.mode) {
    case "list":
      return <NoteCardList {...props} />;
    case "card":
      return <NoteCardCard {...props} />;
    case "grid":
      // return <GridNoteCard {...props} />;
      return <NoteCardGrid {...props} />;
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#687076",
    marginHorizontal: 5,
  },
  listDivider: {
    height: 2,
    backgroundColor: "#313131",
    marginRight: 0,
    marginVertical: 2,
  },
  list: {
    alignItems: "flex-start",
    paddingVertical: 14,
  },
  card: {
    padding: 14,
    borderRadius: 15,
    flexDirection: "column",
    minHeight: 100,
    minWidth: "100%",
    marginBottom: 8,
  },
  grid: {
    borderRadius: 12,
    padding: 14,
    width: "48%",
    minHeight: 120,
    flexDirection: "column",
    alignSelf: "flex-start",
  },
  gridBase: {
    minWidth: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    // backgroundColor: "#f5f5f5",
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 10,
    textAlign: "left",
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  gridContent: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 12,
  },
  gridDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  cardBase: {
    width: "100%",
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  cardContent: {
    fontSize: 12,
    opacity: 0.4,
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 6,
  },
  listBase: {
    minWidth: "100%",
    paddingHorizontal: 14,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 0,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    opacity: 0.8,
  },
  listContent: {
    fontSize: 12,
    opacity: 0.4,
  },
  listDate: {
    fontSize: 12,
    opacity: 0.4,
  },
});

export default NoteCard;
