// Import libraries for making componenet
import React from 'react';
import { Text, View } from 'react-native';

// Make a componenet
const Header = (props) => {
  const { textStyle, viewStyle } = styles;

  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{props.headerText}</Text>;
    </View>
  );
};

const styles = {
  viewStyle: {
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  textStyle: {
    fontSize: 30,

  }
};

// Make the componenet available to other parts of the app
export { Header };
