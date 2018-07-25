import React from 'react';
import { Text, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

//To ensure button is reusable
const GradientButton = ({ onPress, children, disabled, colors }) => {
  const { textStyle, buttonStyle } = styles;

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={buttonStyle}>
      <LinearGradient
        colors={colors}
        style={buttonStyle}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={textStyle}>
          {children}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'NunitoSans-Bold',
  },
  buttonStyle: {
    width: '80%',
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  }
};

GradientButton.defaultProps = {
  colors: ['red', 'blue'],
  children: 'text',
  onPress: () => Alert.alert('You tapped this!')
};

export { GradientButton };
