import React, { Component } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import firebase from 'firebase';
import { CardSection } from './common';

// Differ coz only history has closed rooms
// Food list item inside a room from lobby history

class FoodListItemRoomHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCost: 0,
      ordererName: '',
      paid: null
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
    // Check if order is Paid
    const thisGuyId = this.props.item.uid;
    const { navigation } = this.props;
    const roomId = navigation.getParam('roomId');
    firebase.database().ref(`users/${thisGuyId}/lobbyHistory/${roomId}/items/${thisGuyId}/paid`)
      .once('value')
      .then(snapshot => {
        if (snapshot.val() === 1) {
          this.setState({ paid: true });
        } else {
          this.setState({ paid: false });
        }
      });

    // Get totalCost
    const object = Object.assign({}, this.props.item.order);
    let totalCost = 0;
    delete object.uid;
    Object.entries(object).map(([key, value]) => {
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

        default:
      }
    });
    this.setState({ totalCost });
  }

  onButtonPress() {
    const { navigation } = this.props;
    const roomId = navigation.getParam('roomId');
    const creatorId = navigation.getParam('creatorId');
    const thisGuyId = this.props.item.uid;
    const totalCost = this.state.totalCost;
    firebase.database().ref(`users/${creatorId}/lobbyHistory/${roomId}/items/${thisGuyId}/`)
      .update({ paid: 1 });
    firebase.database().ref(`users/${thisGuyId}/lobbyHistory/${roomId}/items/${thisGuyId}/`)
      .update({ paid: 1 });
    Alert.alert('Marked Paid!');
    this.setState({ paid: true });
    // force update this component NOT DONE YET

    // Settle money statuses
    // Creator side
    firebase.database().ref(`users/${creatorId}/moneyStatus/${thisGuyId}`)
      .once('value')
      .then(snapshot1 => {
        let money = 0;
        if (snapshot1.val() !== null) {
          money = snapshot1.val();
        }
        const newMoney = money - totalCost;
        if (newMoney === 0) {
          firebase.database().ref(`users/${creatorId}/moneyStatus/${thisGuyId}`)
           .remove();
        } else {
          firebase.database().ref(`users/${creatorId}/moneyStatus/${thisGuyId}`)
            .set(newMoney);
        }
      });

    // This guy side
    firebase.database().ref(`users/${thisGuyId}/moneyStatus/${creatorId}`)
      .once('value')
      .then(snapshot1 => {
        let money = 0;
        if (snapshot1.val() !== null) {
          money = snapshot1.val();
        }
        const newMoney = money + totalCost;
        if (newMoney === 0) {
          firebase.database().ref(`users/${thisGuyId}/moneyStatus/${creatorId}`)
           .remove();
        } else {
          firebase.database().ref(`users/${thisGuyId}/moneyStatus/${creatorId}`)
            .set(newMoney);
        }
      });
  }

  renderButton() {
    // If creator, just label as creator, doesnt matter
    if (this.props.creatorName === this.state.ordererName) {
      return (
        <Text style={styles.creatorStyle}> CREATOR </Text>
      );
    } else if (this.props.roomStatus === 'closed') {
      // If not creator and room is closed,
      // Check if paid/not
      if (this.state.paid === true) {
        return (
          <Text style={styles.creatorStyle}> PAID </Text>
        );
      } else if (this.state.paid === false) {
        return (
          <Button
            onPress={() => this.onButtonPress()}
            title="Mark Paid"
          />
        );
      }
    }
    // else it is not closed yet, not creator, just empty.
    return;
  }

  renderOrder() {
    const object = Object.assign({}, this.props.item.order);
    const name = this.state.ordererName;
    let totalCost = 0;
    delete object.uid;
    const list = Object.entries(object).map(([key, value]) => {
      let cost;
      switch (key) {
        case 'T51-ChineseStyle': totalCost += value * 5.50; break;
        case 'T52-ThaiStyle': totalCost += value * 5.50; break;
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
        <View style={{ marginRight: 50 }}>
          {list}
          <Text style={styles.nameStyle}>by {name}, pay ${totalCost}</Text>
        </View>
        {this.renderButton()}

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

export default FoodListItemRoomHistory;
