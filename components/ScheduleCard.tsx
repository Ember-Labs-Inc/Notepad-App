/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import type { Schedule } from "@/models/Schedule";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { updateSchedule, deleteSchedule } from "@/services/scheduleService";
import { Image } from "expo-image";

type ScheduleCardProps = {
  schedule: Schedule;
  schedules: Schedule[];
  mode: "list" | "card" | "grid";
  onPress?: (schedule: Schedule) => void;
  onCompleted?: (id: number) => void;
};

// Format date as dd/mm
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
};

const groupSchedulesByDate = (schedules: Schedule[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const groups: { [label: string]: Schedule[] } = {};

  // First sort all schedules by most recent activity
  const sortedSchedules = [...schedules].sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return bDate.getTime() - aDate.getTime(); // Descending order
  });

  sortedSchedules.forEach((schedule) => {
    const activityDate = new Date(schedule.date);
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
      key = activityDate.toLocaleString("default", { weekday: "long" });
    } else {
      const year = activityDate.getFullYear();
      const currentYear = now.getFullYear();
      key =
        activityDate.toLocaleString("default", { month: "long" }) +
        (year !== currentYear ? ` ${year}` : "");
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(schedule);
  });

  return groups;
};

// Checkbox component
function Checkbox({
  onChange,
  type = "default",
}: {
  onChange?: (checked: boolean) => void;
  type?: "default" | "rounded" | "floating";
}) {
  const [checked, setChecked] = React.useState(false);
  const bgColor = useThemeColor({}, "checkBg");
  const selectionColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "checkBg");
  const checkColor = useThemeColor({}, "tint");

  const handlePress = () => {
    setChecked((prev) => {
      const newChecked = !prev;
      onChange && onChange(newChecked);
      return newChecked;
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        marginLeft: 10,
        marginTop: 0,
      }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View
        style={[
          {
            width: 22,
            height: 22,
            borderRadius: type === "rounded" ? 11 : 6,
            borderWidth: 1,
            borderColor: borderColor,
            backgroundColor: checked ? selectionColor : bgColor,
            justifyContent: "center",
            alignItems: "center",
          },
          type === "floating" && { elevation: 2, shadowColor: "#000" },
        ]}
      >
        {checked && (
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: type === "rounded" ? 6 : 2,
              backgroundColor: checkColor,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../assets/icons/check.png")}
              style={{ height: 16, width: 16, tintColor: "#fff" }}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}

// List style
const ListScheduleCard: React.FC<ScheduleCardProps & { isLast?: boolean }> = ({
  schedule,
  onPress,
  isLast,
  onCompleted,
}) => {
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const handleCheck = async () => {
    if (!schedule.id) return;
    await updateSchedule({ ...schedule, completed: true });
    setTimeout(async () => {
      if (schedule.id !== undefined) {
        await deleteSchedule(schedule.id);
        onCompleted?.(schedule.id);
      }
    }, 300);
  };

  return (
    <>
      <View style={styles.listRow}>
        <TouchableOpacity
          style={[styles.list]}
          onPress={() => onPress?.(schedule)}
          activeOpacity={0.8}
        >
          <View style={[styles.row, { gap: 10 }]}>
            <View
              style={{
                height: "100%",
                width: 3,
                backgroundColor: "#313131",
                borderRadius: 10,
              }}
            ></View>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={[styles.listTitle, { color: textColor }]}
                numberOfLines={1}
              >
                {schedule.title}
              </Text>
              <View style={styles.row}>
                {schedule.date && (
                  <Text style={[styles.listDate, { color: textColor }]}>
                    {formatDate(schedule.date)}
                  </Text>
                )}
                <View style={styles.dot} />
                <Text
                  style={[styles.listContent, { color: textColor }]}
                  numberOfLines={1}
                >
                  {schedule.description?.slice(0, 30)}
                  {schedule.description && schedule.description.length > 30
                    ? "…"
                    : ""}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <Checkbox
          onChange={() => {
            handleCheck();
          }}
        />
      </View>
      {!isLast && <View style={styles.listDivider} />}
    </>
  );
};

// Card style
const CardScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onPress,
  onCompleted,
}) => {
  const bgColor = useThemeColor({}, "defaultNote");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const handleCheck = async () => {
    if (!schedule.id) return;
    await updateSchedule({ ...schedule, completed: true });
    setTimeout(async () => {
      if (schedule.id !== undefined) {
        await deleteSchedule(schedule.id);
        onCompleted?.(schedule.id);
      }
    }, 300);
  };

  return (
    <View style={styles.cardRow}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: bgColor }]}
        onPress={() => onPress?.(schedule)}
        activeOpacity={0.8}
      >
        <View
          style={[
            {
              gap: 10,
              width: "100%",
              flexDirection: "row",
              alignItems: "flex-start",
            },
          ]}
        >
          <View
            style={{
              height: "100%",
              width: 3,
              backgroundColor: "#313131",
              borderRadius: 10,
            }}
          ></View>
          <View style={{ flexDirection: "column" }}>
            {schedule.date && (
              <Text style={[styles.cardDate, { color: textColor }]}>
                {formatDate(schedule.date)}
              </Text>
            )}
            <Text
              style={[styles.cardTitle, { color: textColor }]}
              numberOfLines={1}
            >
              {schedule.title}
            </Text>
            <Text
              style={[styles.cardContent, { color: textColor }]}
              numberOfLines={2}
            >
              {schedule.description?.slice(0, 100)}
              {schedule.description && schedule.description.length > 100
                ? "…"
                : ""}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <Checkbox
        onChange={() => {
          handleCheck();
        }}
      />
    </View>
  );
};

// Grid style
const GridScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onPress,
  onCompleted,
}) => {
  const bgColor = useThemeColor({}, "defaultNote");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const handleCheck = async () => {
    if (!schedule.id) return;
    await updateSchedule({ ...schedule, completed: true });
    setTimeout(async () => {
      if (schedule.id !== undefined) {
        await deleteSchedule(schedule.id);
        onCompleted?.(schedule.id);
      }
    }, 300);
  };

  return (
    <View style={styles.gridRow}>
      <TouchableOpacity
        style={[styles.grid, { backgroundColor: bgColor }]}
        onPress={() => onPress?.(schedule)}
        activeOpacity={0.8}
      >
        <View
          style={[
            {
              gap: 10,
              width: "100%",
              flexDirection: "row",
              alignItems: "flex-start",
            },
          ]}
        >
          <View
            style={{
              height: "100%",
              width: 3,
              backgroundColor: "#313131",
              borderRadius: 10,
            }}
          ></View>

          <View style={{ flexDirection: "column" }}>
            <Text
              style={[styles.gridTitle, { color: textColor }]}
              numberOfLines={1}
            >
              {schedule.title}
            </Text>
            <Text
              style={[styles.gridContent, { color: textColor }]}
              numberOfLines={3}
            >
              {schedule.description?.slice(0, 60)}
              {schedule.description && schedule.description.length > 60
                ? "…"
                : ""}
            </Text>
            {schedule.date && (
              <Text style={[styles.gridDate, { color: textColor }]}>
                {formatDate(schedule.date)}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
      <Checkbox
        onChange={() => {
          handleCheck();
        }}
      />
    </View>
  );
};

// Grouped List
export const ScheduleCardList: React.FC<
  ScheduleCardProps & { onCompleted?: (id: number) => void }
> = ({ schedules, onPress, onCompleted }) => {
  const grouped = groupSchedulesByDate(schedules);
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
    const aDate = new Date(grouped[a][0].date);
    const bDate = new Date(grouped[b][0].date);
    return bDate.getTime() - aDate.getTime();
  });

  // Local state to filter out completed
  const [activeIds, setActiveIds] = React.useState(schedules.map((n) => n.id));

  const handleCompleted = (id: number) => {
    setActiveIds((ids) => ids.filter((_id) => _id !== id));
    onCompleted?.(id);
  };

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
            {grouped[label]
              .filter((schedule) => activeIds.includes(schedule.id))
              .map((schedule, idx, arr) => (
                <ListScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  schedules={[schedule]}
                  onPress={onPress}
                  mode="list"
                  isLast={idx === arr.length - 1}
                  onCompleted={handleCompleted}
                />
              ))}
          </ThemedView>
        </React.Fragment>
      ))}
    </>
  );
};

// Grouped Card
export const ScheduleCardCard: React.FC<
  ScheduleCardProps & { onCompleted?: (id: number) => void }
> = ({ schedules, onPress, onCompleted }) => {
  const grouped = groupSchedulesByDate(schedules);
  const textColor = useThemeColor({}, "text");

  const [activeIds, setActiveIds] = React.useState(schedules.map((n) => n.id));
  const handleCompleted = (id: number) => {
    setActiveIds((ids) => ids.filter((_id) => _id !== id));
    onCompleted?.(id);
  };

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
    const aDate = new Date(grouped[a][0].date);
    const bDate = new Date(grouped[b][0].date);
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
            {grouped[label]
              .filter((schedule) => activeIds.includes(schedule.id))
              .map((schedule) => (
                <CardScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  schedules={[schedule]}
                  onPress={onPress}
                  mode="card"
                  //   onCompleted={handleCompleted}
                />
              ))}
          </ThemedView>
        </React.Fragment>
      ))}
    </>
  );
};

// Grouped Grid
export const ScheduleCardGrid: React.FC<
  ScheduleCardProps & { onCompleted?: (id: number) => void }
> = ({ schedules, onPress, onCompleted }) => {
  const grouped = groupSchedulesByDate(schedules);
  const textColor = useThemeColor({}, "text");

  const [activeIds, setActiveIds] = React.useState(schedules.map((n) => n.id));
  const handleCompleted = (id: number) => {
    setActiveIds((ids) => ids.filter((_id) => _id !== id));
    onCompleted?.(id);
  };

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
    const aDate = new Date(grouped[a][0].date);
    const bDate = new Date(grouped[b][0].date);
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
            {grouped[label]
              .filter((schedule) => activeIds.includes(schedule.id))
              .map((schedule) => (
                <GridScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  schedules={[schedule]}
                  onPress={onPress}
                  mode="grid"
                  //   onCompleted={handleCompleted}
                />
              ))}
          </ThemedView>
        </React.Fragment>
      ))}
    </>
  );
};

// Main ScheduleCard dispatcher
const ScheduleCard: React.FC<
  ScheduleCardProps & { onCompleted?: (id: number) => void }
> = (props) => {
  switch (props.mode) {
    case "list":
      return <ScheduleCardList {...props} />;
    case "card":
      return <ScheduleCardCard {...props} />;
    case "grid":
      return <ScheduleCardGrid {...props} />;
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
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "48%",
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
    flex: 1,
  },
  card: {
    padding: 14,
    borderRadius: 15,
    flexDirection: "column",
    minHeight: 100,
    minWidth: "90%",
    marginBottom: 8,
    flex: 1,
  },
  grid: {
    borderRadius: 12,
    padding: 14,
    width: "100%",
    minHeight: 120,
    flexDirection: "column",
    alignSelf: "flex-start",
    flex: 1,
  },
  gridBase: {
    minWidth: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  checkboxTick: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 20,
  },
});

export default ScheduleCard;
