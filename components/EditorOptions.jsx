import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";

const EditorOptions = ({ keyboardVisible }) => {
  const [active, setActive] = useState(null);
  const tintColor = useThemeColor({}, "tint");

  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "modal");
  // When keyboard appears, close any open option
  useEffect(() => {
    if (keyboardVisible && active) setActive(null);
  }, [active, keyboardVisible]);

  const options = [
    {
      key: "ai",
      icon: require("../assets/icons/ai.png"),
      content: (
        <ThemedView
          style={[styles.optionContainer, { backgroundColor: bgColor }]}
        >
          <ThemedView style={styles.optRow}>
            <Pressable
              style={[styles.optSmButton, { backgroundColor: cardColor }]}
              onPress={() => console.log("Expand Content")}
            >
              <Text style={{ color: textColor }}>Expand</Text>
            </Pressable>

            <Pressable
              style={[styles.optSmButton, { backgroundColor: cardColor }]}
              onPress={() => console.log("Summarize Content")}
            >
              <Text style={{ color: textColor }}>Summary</Text>
            </Pressable>

            <Pressable
              style={[styles.optSmButton, { backgroundColor: cardColor }]}
              onPress={() => console.log("Correct Grammar")}
            >
              <Text style={{ color: textColor }}>Correction</Text>
            </Pressable>

            <Pressable
              style={[styles.optSmButton, { backgroundColor: cardColor }]}
              onPress={() => console.log("Chat with Ember AI")}
            >
              <Text style={{ color: textColor }}>Ember AI</Text>
            </Pressable>
          </ThemedView>
        </ThemedView>
      ),
    },
    {
      key: "camera",
      icon: require("../assets/icons/camera.png"),
      content: (
        <ThemedView
          style={[styles.optionContainer, { backgroundColor: bgColor }]}
        >
          <ThemedView style={styles.optRow}>
            <ThemedView style={[styles.optCard]}>
              <Pressable
                style={[styles.optButton, { backgroundColor: cardColor }]}
                onPress={() => console.log("Capture Image")}
              >
                <Text style={{ color: textColor }}>Take Photo</Text>
              </Pressable>

              <Pressable
                style={[styles.optButton, { backgroundColor: cardColor }]}
                onPress={() => console.log("Open Camera")}
              >
                <Text style={{ color: textColor }}>Choose Photo</Text>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      ),
    },
    {
      key: "typography",
      icon: require("../assets/icons/typography.png"),
      content: (
        <ThemedView
          style={[styles.optionContainer, { backgroundColor: bgColor }]}
        >
          <View style={[styles.typoCard, { backgroundColor: cardColor }]}>
            <View style={[styles.typoRow]}>
              <Pressable
                style={[styles.typoButton, { backgroundColor: cardColor, borderRightColor: bgColor, borderRightWidth: 2 }]}
                onPress={() => console.log("Change Font Size")}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: textColor }}
                >
                  H1
                </Text>
              </Pressable>
              <Pressable
                style={[styles.typoButton, { backgroundColor: cardColor, borderRightColor: bgColor, borderRightWidth: 2 }]}
                onPress={() => console.log("Change Font Size")}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: textColor }}
                >
                  H2
                </Text>
              </Pressable>
              <Pressable
                style={[styles.typoButton, { backgroundColor: cardColor, borderRightColor: bgColor, borderRightWidth: 2 }]}
                onPress={() => console.log("Change Font Size")}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", color: textColor }}
                >
                  H3
                </Text>
              </Pressable>
              <Pressable
                style={[styles.typoButton, { backgroundColor: cardColor, borderRightColor: bgColor, borderRightWidth: 2 }]}
                onPress={() => console.log("Change Font Size")}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", color: textColor }}
                >
                  H4
                </Text>
              </Pressable>
              <Pressable
                style={[styles.typoButton, { backgroundColor: cardColor }]}
                onPress={() => console.log("Change Font Size")}
              >
                <Text style={{ fontSize: 12, color: textColor }}>body</Text>
              </Pressable>
            </View>
          </View>

          <View style={{flexDirection: "row", width: "100%", justifyContent: "space-between", gap: 5 }}>
            <View style={[styles.typoCard, { backgroundColor: cardColor, width: "60%" }]}>
              <View style={[styles.typoRow]}>
                <Pressable
                  style={[styles.typoButton, { backgroundColor: cardColor, borderRightColor: bgColor, borderRightWidth: 2, width: "15%" }]}
                  onPress={() => console.log("Change Font Size")}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: textColor,
                    }}
                  >
                    B
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.typoButton, { backgroundColor: cardColor, borderRightColor: bgColor, borderRightWidth: 2, width: "15%" }]}
                  onPress={() => console.log("Change Font Size")}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "normal",
                      fontStyle: "italic",
                      color: textColor,
                    }}
                  >
                    I
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.typoButton, { backgroundColor: cardColor, borderRightColor: bgColor, borderRightWidth: 2, width: "15%" }]}
                  onPress={() => console.log("Change Font Size")}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "normal",
                      textDecorationLine: "underline",
                      color: textColor,
                    }}
                  >
                    U
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.typoButton, { backgroundColor: cardColor, width: "15%" }]}
                  onPress={() => console.log("Change Font Size")}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "normal",
                      textDecorationLine: "line-through",
                      color: textColor,
                    }}
                  >
                    S
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.typoCard, { backgroundColor: cardColor, width: "35%" }]}>
              <View style={[styles.typoRow]}>
                <Pressable
                  style={[styles.typoButton, { backgroundColor: cardColor, borderRightColor: bgColor, borderRightWidth: 2, width: "50%" }]}
                  onPress={() => console.log("Change Font Size")}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: textColor,
                    }}
                  >
                    B
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.typoButton, { backgroundColor: cardColor, width: "50%" }]}
                  onPress={() => console.log("Change Font Size")}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "normal",
                      fontStyle: "italic",
                      color: textColor,
                    }}
                  >
                    I
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ThemedView>
      ),
    },
    {
      key: "more",
      icon: require("../assets/icons/more.png"),
      content: (
        <ThemedView
          style={[styles.optionContainer, { backgroundColor: bgColor }]}
        >
          <ThemedView style={styles.optRow}>
            <ThemedView style={[styles.optCard]}>
              <Pressable
                style={[styles.optButton, { backgroundColor: cardColor }]}
                onPress={() => console.log("Add Table")}
              >
                <Text style={{ color: textColor }}>Add Table</Text>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {options.map((opt) => (
          <Pressable
            key={opt.key}
            onPress={() => setActive(active === opt.key ? null : opt.key)}
            style={[
              styles.iconButton,
              active === opt.key &&
                !keyboardVisible && {
                  transform: [{ scale: 1 }],
                },
            ]}
          >
            <Image
              source={opt.icon}
              style={[
                styles.icon,
                active === opt.key &&
                  !keyboardVisible && { tintColor: tintColor },
              ]}
            />
          </Pressable>
        ))}
      </View>
      {/* Only show the expanded card if keyboard is NOT visible */}
      {!keyboardVisible && (
        <View
          style={[
            styles.editorOptCard,
            active ? styles.OptCard1 : styles.OptCard2,
          ]}
        >
          {active && options.find((opt) => opt.key === active)?.content}
        </View>
      )}
    </View>
  );
};

export default EditorOptions;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 4,
  },
  iconButton: {
    padding: 0,
    marginHorizontal: 6,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    transitionDuration: "150ms",
  },
  icon: { width: 28, height: 28 },
  editorOptCard: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  OptCard1: {
    marginTop: 8,
  },
  OptCard2: {
    marginTop: 0,
  },
  optionContainer: {
    padding: 15,
    borderRadius: 10,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  optRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: "100%",
  },
  optCard: {
    width: "100%",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  optSmCard: {
    width: "47%",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  optButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  optSmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "47%",
    height: 70,
    padding: 8,
    borderRadius: 10,
    marginVertical: 5,
  },
  typoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  typoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
    maxHeight: 50,
    backgroundColor: "red"
  },
  typoCard: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
