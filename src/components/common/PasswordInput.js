import React from 'react';
import { TextInput, View, Text } from 'react-native';

const PasswordInput = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
  const { inputStyle, labelStyle, containerStyle } = styles;
  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        autoCorrect={false}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        style={inputStyle}
        underlineColorAndroid="transparent"
      />
    </View>
  );
};

const styles = {
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 16,
    lineHeight: 23,
    flex: 2,
    fontFamily: 'NunitoSans-Bold',
  },
  labelStyle: {
    fontSize: 14,
    paddingLeft: 50,
    flex: 1,
    fontFamily: 'NunitoSans-Bold',
  },
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eb6c05',
    borderRadius: 20,
  }
};

export { PasswordInput };
