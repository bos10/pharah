import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

//To ensure button is reusable
const GradientButton = ({ onPress, children, disabled}) => {
  const { textStyle, buttonStyle } = styles;

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={buttonStyle}>

        <Text style={textStyle}>
          {children}
        </Text>

    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#ff7c00',
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
    backgroundColor: '#f7f7f7',

    shadowOffset: { width: 10, height: 0, },
    shadowOpacity: 1.0,
    shadowRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    marginBottom: 2,
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

  // <LinearGradient
  //   style={buttonStyle}
  //   colors={['#F4F4F4', '#FFC300']}
  //   start={{ x: 0, y: 1 }}
  //   end={{ x: 1, y: 1 }}
  // >
