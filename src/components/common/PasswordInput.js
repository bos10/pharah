import React from 'react';
import { TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PasswordInput = ({ value, onChangeText, placeholder, secureTextEntry }) => {
  const { inputStyle, containerStyle, outerContainer } = styles;
  return (
  <View style={outerContainer}>
    <LinearGradient
      style={containerStyle}
      colors={['#d4650b', '#d35f0a']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
    >
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
    flex: 1,
    fontFamily: 'NunitoSans-Bold',
  },
  containerStyle: {
    height: 30,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingLeft: 10,
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
