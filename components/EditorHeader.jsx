import React from "react";
import { StyleSheet, Image, Pressable, Modal } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

const EditorHeader = ({ title, showSave, onSave  }) => {
  const navigation = useRouter();
  const [modalVisible, setModalVisible] = React.useState(false);

  const modalBg = useThemeColor({}, "modal");
  const themeIcon = useThemeColor({}, "text");


  return (
    <>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.row}>
          <Pressable onPress={() => navigation.back()}>
            <Image
              source={require("@/assets/icons/arrow-left.png")}
              style={styles.backIcon}
            />
          </Pressable>
          <ThemedText type="default" style={styles.title}>
            {title}
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.row, { gap: 30 }]}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Image
              source={require("@/assets/icons/options.png")}
              style={styles.optIcon}
            />
          </Pressable>
          {showSave && (
            <Pressable onPress={onSave}>
              <Image
                source={require("@/assets/icons/check.png")}
                style={styles.optIcon}
              />
            </Pressable>
          )}
        </ThemedView>


      </ThemedView>

      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <ThemedView
            style={[styles.modalContent, { backgroundColor: modalBg }]}
          >
            <ThemedView style={styles.innerModal}>
              <Pressable
                style={styles.option}
                onPress={() => {
                  setModalVisible(false);
                  navigation.push("settings");
                }}
              >
                <Image
                  source={require("@/assets/icons/share.png")}
                  style={[styles.optionIcon, { tintColor: themeIcon }]}
                />
                <ThemedText type="default" style={styles.optionText}>
                  Share
                </ThemedText>
              </Pressable>

              <Pressable
                style={styles.option}
                onPress={() => {
                  setModalVisible(false);
                  navigation.push("help");
                }}
              >
                <Image
                  source={require("@/assets/icons/delete.png")}
                  style={[styles.optionIcon, { tintColor: "#FF3737" }]}
                />
                <ThemedText
                  type="default"
                  style={[styles.optionText, { color: "#FF3737" }]}
                >
                  Delete
                </ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </Pressable>
      </Modal>
    </>
  );
};

export default EditorHeader;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    width: 26,
    height: 24,
    marginRight: 20,
  },
  optIcon: {
    width: 26,
    height: 24,
  },
  title: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(6, 6, 6, 0.4)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  modalContent: {
    borderRadius: 15,
    padding: 15,
    width: "90%",
    marginTop: "15%",
    marginRight: 15,
  },
  innerModal: {
    borderRadius: 10,
    padding: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  optionText: {
    fontSize: 13,
  },
});
