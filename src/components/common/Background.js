import React from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Styling for BACKGROUND (Wallpaper)
const Background = (props) => {
  return (
    // Top, Mid, Bottom (Gradient)
    <LinearGradient colors={['#FFAF54', '#ff9e54', '#D17845']} style={styles.linearGradient}>
        {props.children}
    </LinearGradient>
  );
};

const styles = {
  // containerStyle: {
  //   flex: 1,
  //   width: null,
  //   height: null,
  //   backgroundColor: '#FF0000',
  // },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
};

export { Background };
