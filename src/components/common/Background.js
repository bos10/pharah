import React from 'react';
import { View } from 'react-native';

// Styling for BACKGROUND (Wallpaper)
const Background = (props) => {
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: '#FF0000',
  }
};

export { Background };
