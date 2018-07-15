import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

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
  },
};

export { Background };
