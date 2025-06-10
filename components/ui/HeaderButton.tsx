import { StyleSheet, Image, Pressable } from 'react-native';
import React from 'react';

interface HeaderButtonProps {
  icon: any; // The icon image source
  onPress: () => void; // The function to call when the button is pressed
  visible: boolean; // Whether the button should be visible or not
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ icon, onPress, visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Image source={icon} style={styles.icon} />
    </Pressable>
  );
};

export default HeaderButton;

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
});