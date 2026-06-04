import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.message}>{message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: '#676767',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF4C24',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default ErrorState;
