import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AddButton from "@/components/ui/AddButton";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import { StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import { fetchSchedules } from "@/services/scheduleService";
import { Schedule } from "@/models/Schedule";
import {
  ScheduleCardList,
  ScheduleCardGrid,
  ScheduleCardCard,
} from "@/components/ScheduleCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLayout } from "@/contexts/LayoutContext";

export default function ScheduleScreen() {
  const navigation = useRouter();
  const { layoutMode } = useLayout();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const bgColor = useThemeColor({}, "background");
  const params = useLocalSearchParams();
  
  useFocusEffect(
  React.useCallback(() => {
    const loadSchedules = async () => {
      const data = await fetchSchedules();
      setSchedules(data);
    };
    loadSchedules();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.refresh])
);

  const handleSchedulePress = (schedule: Schedule) => {
    navigation.push({
      pathname: "/scheduleEditor",
      params: { scheduleId: schedule.id },
    });
  };

  return (
    <>
      <ThemedView style={styles.titlebar}>
        <ThemedText type="title">Schedules</ThemedText>
      </ThemedView>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: bgColor },
        ]}
        style={{ flex: 1 }}
      >
        <ThemedView style={styles.container}>
          {schedules.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>
                No schedules found
              </ThemedText>
            </ThemedView>
          ) : layoutMode === "grid" ? (
            <ScheduleCardGrid
              schedules={schedules}
              mode="grid"
              onPress={handleSchedulePress}
              schedule={schedules[0]}
            />
          ) : layoutMode === "list" ? (
            <ScheduleCardList
              schedules={schedules}
              mode="list"
              onPress={handleSchedulePress}
              schedule={schedules[0]}
            />
          ) : (
            <ScheduleCardCard
              schedules={schedules}
              mode="card"
              onPress={handleSchedulePress}
              schedule={schedules[0]}
            />
          )}
        </ThemedView>
      </ScrollView>
      <AddButton
        icon={require("@/assets/icons/plus.png")}
        visible={true}
        onPress={() => navigation.push("/scheduleEditor")}
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
    paddingBottom: 80,
  },
  titlebar: {
    width: "100%",
    paddingVertical: 0,
    paddingHorizontal: 20,
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
