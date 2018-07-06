import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ButtonNoBackground = ({ onPress, children }) => {
  const { textStyle, buttonStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#fff',  // Change this colour
    fontSize: 9,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'NunitoSans-Bold',
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 20,
    marginLeft: 5,
    marginRight: 5
  }
};

export { ButtonNoBackground };
// same as export { Button: Button } < key, value, then shortcut coz same name
