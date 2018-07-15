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
    color: '#f4f4f4',
    fontSize: 14,
    fontWeight: '500',
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'NunitoSans-Bold',
  },
  buttonStyle: {
    backgroundColor: 'transparent',
    marginLeft: 5,
    marginRight: 20
  }
};

export { LogoutButton };
// same as export { Button: Button } < key, value, then shortcut coz same name
