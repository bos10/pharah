import React, { Component } from 'react';
import { Text, ScrollView } from 'react-native';
import firebase from 'firebase';
import { CardSection, Button } from '../components/common';

class ThaiKitchen extends Component {
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
          // Fried Rice
          case 'T51-ChineseStyle': foodCost = 5.50; break;
          case 'T52-ThaiStyle': foodCost = 5.50; break;
          case 'T53-Ikan Bilis(Anchovies)': foodCost = 4.50; break;
          case 'T54-Tomato&Chicken': foodCost = 5.50; break;
          // Noodles
          case 'T35-Tomyam (Soup)': foodCost = 6.50; break;
          case 'T36-Pataya (Egg Wrap)': foodCost = 6.50; break;
          case 'T37-Soup with Vegetables': foodCost = 5.50; break;
          case 'T38-Bandung (Red Sauce)': foodCost = 5.50; break;
          case 'T41-Thai Style Fried': foodCost = 5.50; break;
          // Steam Rice
          case 'T45-Hot & Spicy': foodCost = 6.00; break;
          case 'T46-Black Soya Sauce': foodCost = 6.00; break;
          case 'T47-Sweet & Sour': foodCost = 6.00; break;
          case 'T48-Black Pepper': foodCost = 6.00; break;

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
      <ScrollView>
        {/*FRIED RICE*/}
        <Text style={styles.textStyle}> Fried Rice</Text>
        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T51-ChineseStyle')} >
            T51-Chinese Style
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T52-ThaiStyle')}>
            T52-Thai Style
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T53-Ikan Bilis(Anchovies)')}>
             T53-Ikan Bilis (Anchovies)
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T54-Tomato&Chicken')}>
            T54-Tomato & Chicken
          </Button>
        </CardSection>

        {/*NOODLES*/}
        <Text style={styles.textStyle}> Noodles</Text>
        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T35-Tomyam (Soup)')} >
            T31-Tomyam (Soup)
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T36-Pataya (Egg Wrap)')}>
            T36-Pataya (Egg Wrap)
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T37-Soup with Vegetables')}>
            T37-Soup with Vegetables
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T38-Bandung (Red Sauce)')}>
            T38-Bandung (Red Sauce)
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T41-Thai Style Fried')}>
            T41-Thai Style Fried
          </Button>
        </CardSection>

        {/*STEAM RICE*/}
        <Text style={styles.textStyle}> Steam Rice</Text>
        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T45-Hot & Spicy')}>
            T45-Hot & Spicy
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T46-Black Soya Sauce')}>
            T46-Black Soya Sauce
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T47-Sweet & Sour')}>
            T47-Sweet & Sour
          </Button>
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this, 'T48-Black Pepper')}>
            T48-Black Pepper
          </Button>
        </CardSection>

      </ScrollView>
    );
  }
}

export default ThaiKitchen;

const styles = {
  textStyle: {
    fontWeight: '300',
    fontSize: 30,
  }
};
