import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import firebase from 'firebase';
import { CardSection } from './common';


class FoodListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ordererName: ''
    };
  }

  componentDidMount() {
    // Get displayname of user
    const uid = this.props.item.uid;
    firebase.database().ref(`/users/${uid}/displayName`)
      .once('value')
      .then(snapshot => {
        this.setState({ ordererName: snapshot.val() });
      });
  }

  onButtonPress() {
    Alert.alert('gi');
  }

  renderCreator() {
    if (this.props.creatorName === this.state.ordererName) {
      return (
        <Text style={styles.creatorStyle}> CREATOR </Text>
      );
    }
  }

  renderOrder() {
    const object = Object.assign({}, this.props.item.order);
    const name = this.state.ordererName;
    let totalCost = 0;
    delete object.uid;
    const list = Object.entries(object).map(([key, value]) => {
      let cost;
      switch (key) {
        // THAI KITCHEN
        // Fried Rice
        case 'T51-ChineseStyle': totalCost += value * 5.50; break;
        case 'T52-ThaiStyle': totalCost += value * 5.50; break;
        case 'T53-Ikan Bilis(Anchovies)': totalCost += value * 4.50; break;
        case 'T54-Tomato&Chicken': totalCost += value * 5.50; break;

        // Noodles
        case 'T35-Tomyam (Soup)': totalCost += value * 6.50; break;
        case 'T36-Pataya (Egg Wrap)': totalCost += value * 6.50; break;
        case 'T37-Soup with Vegetables': totalCost += value * 5.50; break;
        case 'T38-Bandung (Red Sauce)': totalCost += value * 5.50; break;
        case 'T41-Thai Style Fried': totalCost += value * 5.50; break;

        // Steam Rice
        case 'T45-Hot & Spicy': totalCost += value * 6.00; break;
        case 'T46-Black Soya Sauce': totalCost += value * 6.00; break;
        case 'T47-Sweet & Sour': totalCost += value * 6.00; break;
        case 'T48-Black Pepper': totalCost += value * 6.00; break;

        // WESTERN KITCHEN
        // Chicken
        case 'W40-Grilled Chicken with Pepper': totalCost += value * 11.8; break;
        case 'W41-Grilled Chicken with Mushroom': totalCost += value * 13.80; break;
        case 'W42-Breaded Cutlet': totalCost += value * 10.80; break;

        // Lamb
        case 'W43-Grilled Lamb with Pepper': totalCost += value * 20.50; break;
        case 'W44-Grilled Lamb with Mushroom': totalCost += value * 21.50; break;
        case 'W45-BarBeQue Lamb with Cheese Sauce': totalCost += value * 21.80; break;

        // INDIAN KITCHEN
        // Chicken
        case 'N63-Chicken Korma': totalCost += value * 7; break;
        case 'N64-Chicken Spinach': totalCost += value * 8; break;
        case 'N65-Chicken Masala': totalCost += value * 7; break;
        // Mutton
        case 'N79-Mutton Korma': totalCost += value * 8; break;
        case 'N80-Mutton Masala': totalCost += value * 8; break;
        case 'N81-Mutton Do Piaza': totalCost += value * 9.00; break;

        // DRINKS
        // Hot
        case 'D58-Tea': totalCost += value * 1.5; break;
        case 'D59-Coffee': totalCost += value * 1.5; break;
        case 'D60-Nescafe': totalCost += value * 1.8; break;
        // Cold
        case 'D74-Ice Tea': totalCost += value * 2; break;
        case 'D75-Ice Coffee': totalCost += value * 2; break;
        case 'D76-Ice Nescafe': totalCost += value * 2.5; break;

        // DESERT
        // Ice Cream
        case 'D90-Dark Lava Cake with Strawberry and Milk Ice Cream':
              totalCost += value * 6.8; break;
        case 'D91-Mix Berry Cheese Cake': totalCost += value * 7.5; break;
        case 'D94-Banana Split': totalCost += value * 4.8; break;

        default: cost = 0;
      }

      return (
          //key={key} to pass warning arry must have unique key
          <Text style={styles.detailStyle} key={key}>
            {key.toUpperCase()}(${cost}) x{value.toString()}
          </Text>
      );
    });

    return (
      <CardSection style={styles.cardSectionStyle}>
        <View style={{ marginRight: 100 }}>
          {list}
          <Text style={styles.nameStyle}>by {name}, pay ${totalCost}</Text>
        </View>
        {this.renderCreator()}

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
    color: '#f39c12',
    fontFamily: 'NunitoSans-Bold'
  },
  detailStyle: {
    fontSize: 16,
    fontFamily: 'NunitoSans-Bold'
  },
  creatorStyle: {
    fontFamily: 'NunitoSans-Bold'
  },
  cardSectionStyle: {
    padding: 20,
    borderBottomWidth: 1,
  }
};

export default FoodListItem;
