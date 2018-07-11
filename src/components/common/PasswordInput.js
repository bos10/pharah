import React from 'react';
import { TextInput, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PasswordInput = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
  const { inputStyle, labelStyle, containerStyle, outerContainer } = styles;
  return (
  <View style={outerContainer}>
    <LinearGradient
      style={containerStyle}
      colors={['#d4650b', '#d35f0a']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
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
    </LinearGradient>
  </View>
  );
};

const styles = {
  inputStyle: {
    color: '#F7F7F7',
    paddingRight: 5,
    paddingLeft: 5,
    paddingBottom: 3,
    fontSize: 16,
    lineHeight: 23,
    flex: 2,
    fontFamily: 'NunitoSans-Bold',
  },
  labelStyle: {
    fontSize: 14,
    paddingLeft: 20,
    flex: 1,
    fontFamily: 'NunitoSans-Bold',
    color: '#F7F7F7',
  },
  containerStyle: {
    height: 30,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#eb6c05',
  },
  outerContainer: {
    width: '80%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 1,
  },
};

export { PasswordInput };
