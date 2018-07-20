import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const LogoutButton = ({ onPress, children }) => {
  const { textStyle, buttonStyle } = styles;

  return (
    <TouchableOpacity
    onPress={onPress}
    style={buttonStyle}
    activeOpacity={0.5}
    >
      <Text style={textStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#949494',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'NunitoSans-Bold',
  },
  buttonStyle: {
    backgroundColor: 'transparent',
    marginLeft: 5,
    marginRight: 5,
  }
};

export { LogoutButton };
// same as export { Button: Button } < key, value, then shortcut coz same name
