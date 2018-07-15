import React from 'react';
import { TextInput, View } from 'react-native';
//import EmailImg from '../../images/emailIcon.png';
import LinearGradient from 'react-native-linear-gradient';


const UsernameInput = ({ value, onChangeText, placeholder, secureTextEntry }) => {
  const { inputStyle, containerStyle, outerContainer } = styles;
  return (
  <View style={outerContainer}>

  <LinearGradient
    style={containerStyle}
    colors={['#e97103', '#e76704']}
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
  // What a user types in
  inputStyle: {
    paddingBottom: 3,
    color: '#F7F7F7',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 16,
    lineHeight: 23,
    flex: 2,
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
  }
};

export { UsernameInput };
