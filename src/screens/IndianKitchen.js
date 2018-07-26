import React, { Component } from 'react';
import firebase from 'firebase';
import { ScrollView, Text } from 'react-native';
import { CardSection, Button } from '../components/common';

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
          // Chicken
          case 'N63-Chicken Korma': foodCost = 7; break;
          case 'N64-Chicken Spinach': foodCost = 8; break;
          case 'N65-Chicken Masala': foodCost = 7; break;
          // Mutton
          case 'N79-Mutton Korma': foodCost = 8; break;
          case 'N80-Mutton Masala': foodCost = 8; break;
          case 'N81-Mutton Do Piaza': foodCost = 9; break;

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

    // Get then update room's people's tokens
    firebase.database().ref(`users/${uid}/token`)
      .once('value')
      .then(snapshotToken => {
        const token = snapshotToken.val();
        if (token === null) { return; }
        firebase.database().ref(`lobby/${roomId}/tokenIDs`)
          .update({ [token]: 1 })
          .then(result => {
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
          });
      });
  }

  render() {
    return (
      <ScrollView>
        {/*Chicken*/}
        <Text style={styles.textStyle}> Chicken</Text>
        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'N63-Chicken Korma')} >
            N63-Chicken Korma
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'N64-Chicken Spinach')}>
            N64-Chicken Spinach
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'N65-Chicken Masala')}>
             N65-Chicken Masala
          </Button>
        </CardSection>

        {/*Mutton*/}
        <Text style={styles.textStyle}> Mutton</Text>
        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'N79-Mutton Korma')}>
            N79-Mutton Korma
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'N80-Mutton Masala')}>
            N80-Mutton Masala
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'N81-Mutton Do Piaza')}>
            N81-Mutton Do Piaza
          </Button>
        </CardSection>
      </ScrollView>
    );
  }
}

export default IndianKitchen;

const styles = {
  textStyle: {
    fontWeight: '300',
    fontSize: 30,
  },
};
