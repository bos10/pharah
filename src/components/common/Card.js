import React from 'react';
import { View } from 'react-native';

const Card = (props) => {
  return (
    <View style={[styles.containerStyle, props.style]}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    borderWidth: 1,
    borderRadius: 10, // round the corners
    borderColor: '#f4f4f4',
  //  borderBottomWidth: 1,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,

//    elevation: 2,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10

  }
};

export { Card };
