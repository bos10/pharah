import React, { Component } from 'react';
import firebase from 'firebase';
import { ScrollView, Text } from 'react-native';
import { CardSection, Button } from '../components/common';

class WesternKitchen extends Component {
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
          case 'W40-Grilled Chicken with Pepper': foodCost = 11.8; break;
          case 'W41-Grilled Chicken with Mushroom': foodCost = 13.80; break;
          case 'W42-Breaded Cutlet': foodCost = 10.80; break;

          // Lamb
          case 'W43-Grilled Lamb with Pepper': foodCost = 20.50; break;
          case 'W44-Grilled Lamb with Mushroom': foodCost = 21.50; break;
          case 'W45-BarBeQue Lamb with Cheese Sauce': foodCost = 21.80; break;

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

    // Get ids and update length
    firebase.database().ref(`lobby/${roomId}/userIDs`)
      .once('value')
      .then(snap => {
        if (snap.val() !== null) {
          const obj = snap.val();
          const arr = Object.keys(obj);
          const num = arr.length;
          firebase.database().ref(`lobby/${roomId}`)
            .update({ numberOfIDs: num });
        }
      });
      
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
          <Button onPress={this.onButtonPress.bind(this, 'W40-Grilled Chicken with Pepper')} >
            W40-Grilled Chicken with Pepper
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'W41-Grilled Chicken with Mushroom')}>
            W41-Grilled Chicken with Mushroom
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'W42-Breaded Cutlet')}>
             W42-Breaded Cutlet
          </Button>
        </CardSection>

        {/*Lamb*/}
        <Text style={styles.textStyle}> Lamb</Text>
        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'W43-Grilled Lamb with Pepper')}>
            W43-Grilled Lamb with Pepper
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'W44-Grilled Lamb with Mushroom')}>
            W44-Grilled Lamb with Mushrooms
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'W45-BarBeQue Lamb with Cheese Sauce')}>
            W45-BarBeQue Lamb with Cheese Sauce
          </Button>
        </CardSection>
      </ScrollView>
    );
  }
}

export default WesternKitchen;

const styles = {
  textStyle: {
    fontWeight: '300',
    fontSize: 30,
  },
};
