import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const scheduleEditor = () => {
  return (
    <View style={styles.container}>
      <Text>scheduleEditor</Text>
    </View>
  )
}

export default scheduleEditor

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
})