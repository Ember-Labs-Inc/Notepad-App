import React, { useState, useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { Schedule } from "@/models/Schedule";
import { insertSchedule, updateSchedule } from "@/services/scheduleService";
import { useRouter } from "expo-router";

type PickerType = "dueDate" | "endDate" | "time" | null;

// Helper to format date as dd-mm-yy
const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}-${month}-${year}`;
};

export default function ScheduleEditor() {
  const colors = {
    bg: useThemeColor({}, "modal"),
    button: useThemeColor({}, "tint"),
    modalBg: useThemeColor({}, "background"),
    text: useThemeColor({}, "text"),
    placeholderText: useThemeColor({}, "placeholder"),
    tint: useThemeColor({}, "tint"),
  };

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [currentPicker, setCurrentPicker] = useState<PickerType>(null);
  const [scheduleId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigation = useRouter();

  const handleScheduleCreation = async () => {
    // Validation: Ensure required fields are filled
    if (!title.trim() || !description.trim() || !dueDate || !time) {
      alert(
        "Please fill in all required fields (title, description, due date, and time)."
      );
      return;
    }

    const schedule: Schedule = {
      id: scheduleId ?? undefined,
      title: title.trim(),
      description: description.trim(),
      date: dueDate ? dueDate.toISOString().split("T")[0] : "",
      time: time
        ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "",
      completed: false,
    };

    try {
      if (scheduleId) {
        await updateSchedule(schedule);
        alert("Schedule updated!");
      } else {
        await insertSchedule(schedule);
        alert("Schedule created!");
      }
      navigation.replace({
        pathname: "/(tabs)/schedule",
        params: { refresh: Date.now().toString() },
      });
      // Optionally, navigate back or reset fields here
    } catch {
      alert("Failed to save schedule.");
    }
  };

  const handlePickerChange = useCallback(
    (_: any, selectedDate?: Date) => {
      if (selectedDate) {
        switch (currentPicker) {
          case "dueDate":
            // Merge existing time with new date
            const newDueDate = new Date(selectedDate);
            if (dueDate && time) {
              newDueDate.setHours(time.getHours());
              newDueDate.setMinutes(time.getMinutes());
            }
            setDueDate(newDueDate);
            break;
          case "endDate":
            // Similar merging for endDate
            const newEndDate = new Date(selectedDate);
            if (endDate && time) {
              newEndDate.setHours(time.getHours());
              newEndDate.setMinutes(time.getMinutes());
            }
            setEndDate(newEndDate);
            break;
          case "time":
            setTime(selectedDate);
            // Update existing dates with new time
            if (dueDate) {
              const updatedDueDate = new Date(dueDate);
              updatedDueDate.setHours(selectedDate.getHours());
              updatedDueDate.setMinutes(selectedDate.getMinutes());
              setDueDate(updatedDueDate);
            }
            if (endDate) {
              const updatedEndDate = new Date(endDate);
              updatedEndDate.setHours(selectedDate.getHours());
              updatedEndDate.setMinutes(selectedDate.getMinutes());
              setEndDate(updatedEndDate);
            }
            break;
        }
      }
      setCurrentPicker(null);
    },
    [currentPicker, dueDate, endDate, time]
  );

  const renderDateModal = () => (
    <Modal transparent animationType="none" visible={!!currentPicker}>
      <View
        style={[styles.modalContainer, { backgroundColor: colors.modalBg }]}
      >
        {currentPicker && (
          <DateTimePicker
            key={`${currentPicker}-${
              currentPicker === "dueDate"
                ? dueDate?.getTime()
                : currentPicker === "endDate"
                ? endDate?.getTime()
                : time?.getTime()
            }`}
            value={
              currentPicker === "dueDate"
                ? dueDate || new Date()
                : currentPicker === "endDate"
                ? endDate || new Date()
                : time || new Date()
            }
            mode={currentPicker === "time" ? "time" : "date"}
            display="spinner"
            onChange={handlePickerChange}
            style={{ width: "100%", backgroundColor: colors.modalBg }}
          />
        )}
        {Platform.OS === "ios" && (
          <Pressable
            style={[styles.modalButton, { backgroundColor: colors.tint }]}
            onPress={() => setCurrentPicker(null)}
          >
            <ThemedText style={{ color: "#fff" }}>Done</ThemedText>
          </Pressable>
        )}
      </View>
    </Modal>
  );

  const DateButton = ({
    type,
    value,
    label,
    icon,
  }: {
    type: PickerType;
    value: Date | null;
    label: string;
    icon?: any;
  }) => {
    const isPlaceholder = !value;
    return (
      <Pressable
        onPress={() => setCurrentPicker(type)}
        style={[
          styles.input,
          {
            backgroundColor: colors.bg,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
          },
        ]}
      >
        <ThemedText
          type="default"
          style={{
            color: isPlaceholder ? colors.placeholderText : colors.text,
            flex: 1,
          }}
        >
          {isPlaceholder
            ? `Select ${label}`
            : type === "time"
            ? value!.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : formatDate(value!)}
        </ThemedText>
        {icon && (
          <Image
            source={icon}
            style={{ marginLeft: 8, height: 20, width: 20 }}
          />
        )}
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.inputField}>
          <ThemedText type="default">Title</ThemedText>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.bg, color: colors.text },
            ]}
            placeholder="Enter your title"
            placeholderTextColor={colors.placeholderText}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputField}>
          <ThemedText type="default">Description</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.bg,
                height: 120,
                textAlignVertical: "top",
                paddingTop: 12,
                color: colors.text,
              },
            ]}
            placeholder="Enter your description"
            placeholderTextColor={colors.placeholderText}
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputField, { width: "48%" }]}>
            <ThemedText type="default">Due Date</ThemedText>
            <DateButton
              type="dueDate"
              value={dueDate}
              label="date"
              icon={require("@/assets/icons/date.png")}
            />
          </View>

          <View style={[styles.inputField, { width: "48%" }]}>
            <ThemedText type="default">End Date</ThemedText>
            <DateButton
              type="endDate"
              value={endDate}
              label="date"
              icon={require("@/assets/icons/date.png")}
            />
          </View>
        </View>

        <View style={styles.inputField}>
          <ThemedText type="default">Timeline</ThemedText>
          <DateButton
            type="time"
            value={time}
            label="time"
            icon={require("@/assets/icons/time.png")}
          />
        </View>

        {renderDateModal()}

        {Platform.OS === "android" && currentPicker && (
          <DateTimePicker
            key={`android-${currentPicker}-${
              currentPicker === "dueDate"
                ? dueDate?.getTime()
                : currentPicker === "endDate"
                ? endDate?.getTime()
                : time?.getTime()
            }`}
            value={
              currentPicker === "dueDate"
                ? dueDate || new Date()
                : currentPicker === "endDate"
                ? endDate || new Date()
                : time || new Date()
            }
            mode={currentPicker === "time" ? "time" : "date"}
            display="default"
            onChange={handlePickerChange}
          />
        )}

        <Pressable
          style={[styles.button, { backgroundColor: colors.button }]}
          onPress={handleScheduleCreation}
        >
          <ThemedText type="default">
            {scheduleId ? "Update Schedule" : "Create Schedule"}
          </ThemedText>
        </Pressable>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  inputField: {
    width: "100%",
    marginBottom: "5%",
  },
  input: {
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 15,
  },
  button: {
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: "10%",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  modalButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  keyboardAvoid: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexGrow: 1,
    paddingTop: "10%",
  },
});
