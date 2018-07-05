import React from 'react';
import { TextInput, View, Text, Image } from 'react-native';
import Dimensions from 'Dimensions';
//import EmailImg from '../../images/emailIcon.png';
import LinearGradient from 'react-native-linear-gradient';

import { GradientInput } from './';

const deviceHeight = Dimensions.get('window').width;
const deviceWidth = Dimensions.get('window').height;

const UsernameInput = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
  const { inputStyle, labelStyle, containerStyle, outerContainer } = styles;
  return (
  <View style={outerContainer}>

  <LinearGradient
    style={containerStyle}
    colors={['#e97103', '#e76704']}
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
  // What a user types in
  inputStyle: {
    color: '#F7F7F7',
    paddingRight: 5,
    paddingLeft: 5,
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
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  //  borderColor: '#fcddf2',
  //  borderWidth: 1,
  //  backgroundColor: '#eb6c05',
  },
  outerContainer: {
    width: '80%',
    height: 40,
  //  borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  //  backgroundColor: '#f7f7f7',
  }
};

export { UsernameInput };

// <View style={containerStyle}>
//     {/* </View> */}
