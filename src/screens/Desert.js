import React, { Component } from 'react';
import firebase from 'firebase';
import { ScrollView, Text } from 'react-native';
import { CardSection, Button } from '../components/common';

class Desert extends Component {
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
          // Ice Cream
          case 'D90-Dark Lava Cake with Strawberry and Milk Ice Cream': foodCost = 6.8; break;
          case 'D91-Mix Berry Cheese Cake': foodCost = 7.5; break;
          case 'D94-Banana Split': foodCost = 4.8; break;

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

    // Get then update room's people's tokens then push all
    firebase.database().ref(`users/${uid}/token`)
      .once('value')
      .then(snapshotToken => {
        const token = snapshotToken.val();
        if (token === null) { return; }
        firebase.database().ref(`lobby/${roomId}/tokenIDs`)
          .update({ [token]: 1 })
          .then(result => {
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

    // Push the whole room and data to all the user's LobbyHistorys

  }

  render() {
    return (
      <ScrollView>

        {/*Ice Cream*/}
        <Text style={styles.textStyle}> Ice Cream</Text>
        <CardSection>
          <Button
            onPress={this.onButtonPress.bind(this,
            'D90-Dark Lava Cake with Strawberry and Milk Ice Cream')}
          >
            D90-Dark Lava Cake with Strawberry and Milk Ice Cream
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'D91-Mix Berry Cheese Cake')}>
            D91-Mix Berry Cheese Cake
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'D94-Banana Split')}>
             D94-Banana Split
          </Button>
        </CardSection>

      </ScrollView>
    );
  }
}

export default Desert;

const styles = {
  textStyle: {
    fontWeight: '300',
    fontSize: 30,
  },
};
