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
    marginLeft: 10,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 5,
  }
};

export { Card };
