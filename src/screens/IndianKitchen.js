import React, { Component } from 'react';
import firebase from 'firebase';
import { Card, CardSection, Button } from '../components/common';

class IndianKitchen extends Component {
  onButtonPress(food) {
    // Send data of this food to lobby/roomid/items/name/
    const { navigation } = this.props;
    const roomId = navigation.getParam('roomId');

    // Get name as first part of email
    const uid = firebase.auth().currentUser.uid;

    let oldFoodValue;
    let newFoodValue;
    let foodCost;
    let oldRoomTotalPrice;
    let newRoomTotalPrice;

    // Fetch current value of old food
    firebase.database().ref(`lobby/${roomId}/items/${uid}/order/${food}`)
      .on('value', snapshot2 => {
        oldFoodValue = snapshot2.val();
        if (oldFoodValue == null) {
          newFoodValue = 1;
        } else {
          newFoodValue = oldFoodValue + 1;
        }
      });

    // Update new value
    firebase.database().ref(`lobby/${roomId}/items/${uid}/order`)
      .update({ [food]: newFoodValue });

    // Fetch current value of oldRoomPrice
    firebase.database().ref(`lobby/${roomId}/roomTotalPrice`)
      .on('value', snapshot3 => {
        oldRoomTotalPrice = snapshot3.val();
        switch (food) {
          case 'prata': foodCost = 1; break;
          case 'drink': foodCost = 0.5; break;
          case 'maggie': foodCost = 2; break;
          case 'test': foodCost = 3; break;
          default: foodCost = 0;
        }

        if (oldRoomTotalPrice == null) {
          newRoomTotalPrice = foodCost;
        } else {
          newRoomTotalPrice = oldRoomTotalPrice + foodCost;
        }
      });

    // Update new room total price
    firebase.database().ref(`lobby/${roomId}/`)
      .update({ roomTotalPrice: newRoomTotalPrice });

    // Update room's people's IDs
    firebase.database().ref(`lobby/${roomId}/userIDs`)
      .update({ [uid]: 1 });

    // Push the whole room and data to all the user's LobbyHistorys
    firebase.database().ref(`lobby/${roomId}/userIDs`)
      .once('value')
      .then(snapshot4 => {
        const object = snapshot4.val();
        if (object === null) { return; }
        const userIDs = Object.keys(object);
        firebase.database().ref(`lobby/${roomId}/`)
          .once('value')
          .then(snapshot5 => {
            userIDs.forEach(eachuid => {
              firebase.database().ref(`users/${eachuid}/lobbyHistory/${roomId}`)
                .set(snapshot5.val());
            });
          });
      });
  }

  render() {
    return (
      <Card>
        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'prata')} >
            prata
          </Button>
        </CardSection>
        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'maggie')}>
            maggie
          </Button>
        </CardSection>
        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'drink')}>
            drink
          </Button>
        </CardSection>

      </Card>
    );
  }
}

export default IndianKitchen;
