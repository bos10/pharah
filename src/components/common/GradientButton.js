import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

//To ensure button is reusable
const GradientButton = ({ onPress, children, disabled}) => {
  const { textStyle, buttonStyle } = styles;

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={buttonStyle}>
      <LinearGradient
        style={buttonStyle}
        colors={['#F4F4F4', '#FFC300']}
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
    alignSelf: 'center',
    color: '#A40606',
    fontSize: 14,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'NunitoSans-Bold',
  },
  buttonStyle: {
    width: '80%',
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }
};

export { GradientButton };


  //   flex: 1,
  //   alignSelf: 'stretch',
  // //  backgroundColor: 'transparent',
  //   borderRadius: 20,
  //   borderWidth: 1,
  //   //borderColor: '#FF000',
  //   marginLeft: 5,
  //   marginRight: 5
