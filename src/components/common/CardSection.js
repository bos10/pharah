import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
  return (
      //style more to the right will override
      <View style={[styles.containerStyle, props.style]}>
        {props.children}
      </View>
  );
};

const styles = {
  containerStyle: {
  //  borderBottomWidth: 1,
    padding: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  // borderColor: '#ddd',
    position: 'relative'
  }
};

export { CardSection };
