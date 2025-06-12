import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

const SimpleHeader = ({ title }) => {
  const navigation = useRouter();
  const bgColor = useThemeColor({}, 'background');

  return (
    <View style={[styles.header, { backgroundColor: bgColor }]}>
      <Pressable onPress={() => navigation.back()}>
        <Image source={require('@/assets/icons/arrow-left.png')} style={styles.backIcon} />
      </Pressable>
      <ThemedText style={styles.title}>{title}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
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
    fontSize: 16,
  },
});

export default SimpleHeader;