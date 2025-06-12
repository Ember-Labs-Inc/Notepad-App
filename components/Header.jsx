/* eslint-disable no-unused-vars */
import React from 'react';
import { StyleSheet } from 'react-native';
import {  useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import HeaderButton from './ui/HeaderButton';
import { ThemedView } from './ThemedView';
import LayoutButton from './ui/LayoutButton';

const Header = () => {
  const navigation = useRouter();
  const route = useRoute();


  return (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerBtns}>
        <LayoutButton visible={true} />
        <HeaderButton
          icon={require('@/assets/icons/settings.png')}
          visible={true}
          onPress={() => navigation.push('settings')}
        />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    color: '#fff',
    fontSize: 18,
  },
  logoSpan: {
    color: '#FF2F2F',
    fontSize: 18,
  },
  headerBtns: {
    flexDirection: 'row',
  },
});

export default Header;