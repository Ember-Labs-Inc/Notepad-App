import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const EditorHeader = ({ title }) => {
  const navigation = useRouter();

  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.back()}>
        <Image source={require('@/assets/icons/arrow-left.png')} style={styles.backIcon} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default EditorHeader;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#111111',
    paddingVertical: 5,
    paddingHorizontal: 15,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 26,
    height: 24,
    marginRight: 20,
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
});

