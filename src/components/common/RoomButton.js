import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const RoomButton = ({ onPress, children, buttonStyle, textStyle }) => {
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
    color: '#f4f4f4',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'NunitoSans-Bold',
    textAlign: 'center'
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0
  }
};

export { RoomButton };
// same as export { Button: Button } < key, value, then shortcut coz same name
