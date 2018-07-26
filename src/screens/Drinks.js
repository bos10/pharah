import React, { Component } from 'react';
import firebase from 'firebase';
import { ScrollView, Text } from 'react-native';
import { CardSection, Button } from '../components/common';

class Drinks extends Component {
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
          // Hot
          case 'D58-Tea': foodCost = 1.5; break;
          case 'D59-Coffee': foodCost = 1.5; break;
          case 'D60-Nescafe': foodCost = 1.8; break;
          // Cold
          case 'D74-Ice Tea': foodCost = 2; break;
          case 'D75-Ice Coffee': foodCost = 2; break;
          case 'D76-Ice Nescafe': foodCost = 2.5; break;

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
        {/*Hot*/}
        <Text style={styles.textStyle}> Hot</Text>
        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'D58-Tea')} >
            D58-Tea
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'D59-Coffee')}>
            D59-Coffee
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'D60-Nescafe')}>
             D60-Nescafe
          </Button>
        </CardSection>

        {/*Cold*/}
        <Text style={styles.textStyle}> Cold</Text>
        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'D74-Ice Tea')}>
            D74-Ice Tea
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'D75-Ice Coffee')}>
            D75-Ice Coffee
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'D76-Ice Nescafe')}>
            D76-Ice Nescafe
          </Button>
        </CardSection>
      </ScrollView>
    );
  }
}

export default Drinks;

const styles = {
  textStyle: {
    fontWeight: '300',
    fontSize: 30,
  },
};
