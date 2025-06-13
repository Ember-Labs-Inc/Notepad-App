// components/ui/LayoutButton.tsx
import { StyleSheet, Image, Pressable, Modal, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { ThemedText } from '../ThemedText';

import { useLayout } from '../../contexts/LayoutContext';
import type { LayoutMode } from '../../contexts/LayoutContext';
import { ThemedView } from '../ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';


interface LayoutButtonProps {
  visible: boolean;
}

const layoutOptions = [
  { mode: 'list', label: 'List View', icon: require('@/assets/icons/list-view.png') },
  { mode: 'card', label: 'Card View', icon: require('@/assets/icons/card-view.png') },
  { mode: 'grid', label: 'Grid View', icon: require('@/assets/icons/grid-view.png') },
];

const LayoutButton: React.FC<LayoutButtonProps> = ({ visible }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { layoutMode, setLayoutMode } = useLayout();
  const modalBg = useThemeColor({}, 'modal');
  
  if (!visible) return null;

  const currentLayout = layoutOptions.find(option => option.mode === layoutMode);

  return (
    <>
      <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
        <Image source={currentLayout?.icon} style={styles.icon} />
      </Pressable>

      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setModalVisible(false)}
        >
          <ThemedView style={[styles.modalContent, { backgroundColor: modalBg }]}>
            {layoutOptions.map((option) => (
              <TouchableOpacity
                key={option.mode}
                style={styles.option}
                onPress={() => {
                  setLayoutMode(option.mode as LayoutMode);
                  setModalVisible(false);
                }}
              >
                <Image source={option.icon} style={styles.optionIcon} />
                <ThemedText style={styles.optionText}>{option.label}</ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: { padding: 10 },
  icon: { width: 24, height: 24 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 6, 6, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  modalContent: {
    borderRadius: 15,
    padding: 20,
    paddingVertical: 13,
    width: '50%',
    marginTop: '25%',
    marginRight: 15,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  optionText: {
    fontSize: 14,
  },
});

export default LayoutButton;