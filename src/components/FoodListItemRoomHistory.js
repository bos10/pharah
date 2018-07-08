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
        case 'prata': totalCost += value * 1; break;
        case 'drink': totalCost += value * 0.5; break;
        case 'maggie': totalCost += value * 2; break;
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
        <Text> CREATOR </Text>
      );
    } else if (this.props.roomStatus === 'closed') {
      // If not creator and room is closed,
      // Check if paid/not
      if (this.state.paid === true) {
        return (
          <Text> PAID </Text>
        );
      } else if (this.state.paid === false) {
        return (
          <Button
            onPress={() => this.onButtonPress()}
            title=" Mark Paid"
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
        <View style={{ marginRight: 100 }}>
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
    color: '#ef4836',
  },
  detailStyle: {
    fontSize: 18,
  },
  cardSectionStyle: {
    padding: 20,
    borderBottomWidth: 2,
  }
};

export default FoodListItemRoomHistory;
