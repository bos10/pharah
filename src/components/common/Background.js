import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
//import BackgroundImg from '../../images/orangeBackground1.png';

// Styling for BACKGROUND (Wallpaper)
const Background = (props) => {
  return (
    // Top, Mid, Bottom (Gradient) d65f2a
    <LinearGradient colors={['#ff7000', '#ff7101', '#ff7c00']} style={styles.linearGradient}>
        {props.children}
    </LinearGradient>
  );
};

const styles = {

  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
};

export { Background };

// If want to use image as background :
// <ImageBackground style={styles.containerStyle} source={BackgroundImg}>
//   {props.children}
// </ImageBackground>
