import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';
import BackgroundImg from '../../images/orangeBackground1.png';

// Styling for BACKGROUND (Wallpaper)
const Background = (props) => {
  return (
    <ImageBackground style={styles.containerStyle} source={BackgroundImg}>
      {props.children}
    </ImageBackground>
  );
};

const styles = {
   containerStyle: {
    flex: 1,
    width: null,
    height: null,
   },
  // linearGradient: {
  //   flex: 1,
  //   paddingLeft: 15,
  //   paddingRight: 15,
  //   borderRadius: 5
  // },
};

export { Background };

// Top, Mid, Bottom (Gradient)
// <LinearGradient colors={['#FFAF54', '#ff9e54', '#D17845']} style={styles.linearGradient}>
//     {props.children}
// </LinearGradient>
