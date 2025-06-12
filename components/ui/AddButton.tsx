import { StyleSheet, Image, Pressable } from 'react-native';
import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

interface AddButtonProps {
  icon: any;
  onPress: () => void;
  visible: boolean;
}

const AddButton: React.FC<AddButtonProps> = ({ icon, onPress, visible }) => {
  const tintColor = useThemeColor({}, 'tint');
  const bgColor = useThemeColor({}, 'addButton');

  if (!visible) {
    return null;
  }

  return (
    <Pressable onPress={onPress} style={[styles.button, { backgroundColor: bgColor }]}>
      <Image source={icon} style={[styles.icon, { tintColor }]} />
    </Pressable>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    padding: 10,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 2,
    right: '10%',
    bottom: '5%',
    height: 50,
    width: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});