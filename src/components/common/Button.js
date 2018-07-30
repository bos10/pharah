import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, children, textStyle, buttonStyle }) => {
  return (
    <TouchableOpacity
    onPress={onPress}
    style={[styles.buttonStyle, buttonStyle]}
    activeOpacity={0.5}
    >
      <Text style={[styles.textStyle, textStyle]}>
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
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#F4F4F4',
    borderRadius: 20,
    marginLeft: 5,
    marginRight: 5

  }
};

export { Button };
// same as export { Button: Button } < key, value, then shortcut coz same name
