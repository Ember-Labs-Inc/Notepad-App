import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const taskEditor = () => {
  return (
    <View style={styles.container}>
      <Text>taskEditor</Text>
    </View>
  )
}

export default taskEditor

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})