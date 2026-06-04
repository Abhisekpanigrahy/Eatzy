import React from 'react';
import { StyleSheet, View } from 'react-native';

const BackArrow = ({ color = '#FF4C24', size = 20, thickness = 3.5 }) => {
  return (
    <View style={[styles.container, { width: size + 4, height: size }]}>
      {/* Arrow shaft */}
      <View
        style={[
          styles.shaft,
          {
            backgroundColor: color,
            height: thickness,
            borderRadius: thickness / 2,
            left: 2,
          },
        ]}
      />
      {/* Arrow head */}
      <View
        style={[
          styles.head,
          {
            borderColor: color,
            borderLeftWidth: thickness,
            borderBottomWidth: thickness,
            width: size / 2,
            height: size / 2,
            left: 2,
            top: size / 4,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'relative',
  },
  shaft: {
    width: '90%',
    position: 'absolute',
  },
  head: {
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
  },
});

export default BackArrow;
