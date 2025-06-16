/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#3A86FF'; 
const tintColorDark = '#3A86FF'; 

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    placeholder: '#888888',
    checkBg: '#313131',
    defaultNote: '#F5F5F5',
    modal: '#F5F5F5',
    addButton: '#F5F5F5',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#121212',
    placeholder: '#888888',
    checkBg: '#313131',
    defaultNote: '#1E1E1E',
    modal: '#1E1E1E',
    addButton: '#1E1E1E',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
