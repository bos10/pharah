import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
//import BackgroundImg from '../../images/orangeBackground1.png';

// Styling for BACKGROUND (Wallpaper)
const Background = (props) => {
  return (
    // Top, Mid, Bottom (Gradient) d65f2a
    <LinearGradient colors={['#ef6c00', '#f57c00', '#ef6c00']} style={styles.linearGradient}>
        {props.children}
    </LinearGradient>
  );
};

const styles = {
   // containerStyle: {
   //  flex: 1,
   //  width: null,
   //  height: null,
   // },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
};

export { Background };

// Top, Mid, Bottom (Gradient)
// <LinearGradient colors={['#ffd21e', '#d88f00', '#ffd21e']} style={styles.linearGradient}>
//     {props.children}
// </LinearGradient>

// <ImageBackground style={styles.containerStyle} source={BackgroundImg}>
//   {props.children}
// </ImageBackground>
