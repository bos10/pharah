import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { CardSection } from './common';


class FoodListItem extends Component {

  renderOrder() {
    const object = Object.assign({}, this.props.item);
    const name = object.ordererName;
    let totalCost = 0;
    delete object.ordererName;
    const list = Object.entries(object).map(([key, value]) => {
      let cost;
      switch (key) {
        case 'prata': cost = 1; totalCost += value * 1; break;
        case 'drink': cost = 0.5; totalCost += value * 0.5; break;
        case 'maggie': cost = 2; totalCost += value * 2; break;
        default: cost = 0;
      }

      return (
          //key={key} to pass warning arry must have unique key
          <Text style={styles.detailStyle} key={key}>
            {key}(${cost}) x{value.toString()}
          </Text>
      );
    });

    return (
      <CardSection style={styles.cardSectionStyle}>
        {list}
        <Text style={styles.nameStyle}>by {name}, pay ${totalCost}</Text>
      </CardSection>
    );
  }

  render() {
    return (
        <View>
          {this.renderOrder()}
        </View>
    );
  }
}

const styles = {
  nameStyle: {
    fontSize: 18,
    color: '#ef4836',
  },
  detailStyle: {
    fontSize: 18,
  },
  cardSectionStyle: {
    padding: 20,
    borderBottomWidth: 2,
    flexDirection: 'column'
  }
};

export default FoodListItem;
