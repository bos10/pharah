import React, { Component } from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import { View, ScrollView, Text, FlatList } from 'react-native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import call from 'react-native-phone-call';
import FCM from 'react-native-fcm';
import { CardSection, RoomButton } from '../components/common';
import FoodListItem from '../components/FoodListItem';

const args = {
  // dominos for now
  number: '62226333',
  prompt: false // Optional boolean property.
};

// Represents a Room from Lobby
// Takes the roomid from ListItem to get from firebase lobbyTaken
// Buttons include (Add food, delete room, order)

class Room extends Component {
  state = {
    orders: [],
    roomTotalPrice: 0
  }

  componentDidMount() {
    const { navigation } = this.props;
    const roomId = navigation.getParam('roomId');

    // Reference for Room's items, setstate
    firebase.database().ref(`lobby/${roomId}/items/`)
      .on('value', snapshot => {
        const orders = _.map(snapshot.val(), (val, uid) => {
          return { ...val, uid, roomId };
        });
        this.setState({ orders });
      });

    // Reference for Room's total price, setstate
    firebase.database().ref(`lobby/${roomId}/roomTotalPrice`)
      .on('value', snapshot => {
        this.setState({ roomTotalPrice: snapshot.val() });
      });
  }

  placeOrder() {
    const { navigation } = this.props;
    const roomId = navigation.getParam('roomId');
    // Remove the closing time notification since not needed
    FCM.cancelLocalNotification(roomId);
    // Update lobby as closed in respective lobby histories
    firebase.database().ref(`lobby/${roomId}/userIDs`)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val();
        if (object === null) { return; }
        const userIDs = Object.keys(object);
        userIDs.forEach(uid => {
          firebase.database().ref(`users/${uid}/lobbyHistory/${roomId}`)
            .update({ roomStatus: 'closed' });
        });
      });
    this.settleMoney();
    this.deleteRoomFromLobby();
  }

  settleMoney() {
    const { navigation } = this.props;
    const roomId = navigation.getParam('roomId');
    const creatorId = navigation.getParam('creatorId');
    firebase.database().ref(`lobby/${roomId}/items`)
      .once('value')
      .then(snapshot => {
        const orderItems = snapshot.val();
        for (const id in orderItems) {
          // If id is creator, do nothing since he pays his own
          if (id === creatorId) { continue; }
          const uid = id;
          const itemsOrdered = orderItems[id].order;
          this.settleFirebaseMoneyPerPerson(creatorId, uid, itemsOrdered);
        }
      });
  }

  settleFirebaseMoneyPerPerson(creatorId, uid, itemsOrdered) {
    let totalCost = 0;
    Object.entries(itemsOrdered).map(([key, value]) => {
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

        default: break;
      }
    });
    // + means others owe u
    // - means u owe others
    // Each id, + the creator, - the // id guy
    firebase.database().ref(`users/${creatorId}/moneyStatus/${uid}`)
      .once('value')
      .then(snapshot => {
        var oldVal = 0;
        if (snapshot.val() !== null) {
          oldVal = snapshot.val();
        }
        const newVal = oldVal + totalCost;
        firebase.database().ref(`users/${creatorId}/moneyStatus`)
          .update({ [uid]: newVal });
      });

    firebase.database().ref(`users/${uid}/moneyStatus/${creatorId}`)
      .once('value')
      .then(snapshot => {
        var oldVal = 0;
        if (snapshot.val() !== null) {
          oldVal = snapshot.val();
        }
        const newVal = oldVal - totalCost;
        firebase.database().ref(`users/${uid}/moneyStatus`)
          .update({ [creatorId]: newVal });
      });
  }

  deleteRoomFromLobby() {
    const { navigation } = this.props;
    const roomId = navigation.getParam('roomId');
    // Check status, if still open, must remove from times array
    firebase.database().ref(`lobby/${roomId}/roomStatus`)
      .once('value')
      .then(snapshot => {
        if (snapshot.val() === 'open') {
          firebase.database().ref('lobby/times/')
            .once('value')
            .then(snapshot1 => {
              if (snapshot1.val() != null) {
                const arr = snapshot1.val();
                  for (let i = 0; i < arr.length; i++) {
                    const obj = arr[i];
                    if (obj.roomId === roomId) {
                      arr.splice(i, 1);
                      break;
                    }
                  }
                  // Update the array of times in database
                  firebase.database().ref('/lobby')
                    .update({ times: arr });
              }
            });
        }
      });
      // Remove the room from lobby
      this.props.navigation.goBack();
      // Create a dummy in push, REMOVE ROOM, then remove the dummy
      // This is to ensure lobby is not null if not flatlist got issue
      // Issue - when last room is pending and deleted, still remain in list.
      const pushkey = firebase.database().ref('lobby/times/')
        .push({ dummy: 'dummy' }); // dummy

      firebase.database().ref(`lobby/${roomId}`).remove();

      firebase.database().ref(`lobby/times/${pushkey.key}`).remove(); // dummy
  }

  deleteRoom() {
    const { navigation } = this.props;
    const roomId = navigation.getParam('roomId');
    // Remove the closing time notification since not needed
    FCM.cancelLocalNotification(roomId);
    // Delete lobby in respective lobby histories
    firebase.database().ref(`lobby/${roomId}/userIDs`)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val();
        if (object === null) { return; }
        const userIDs = Object.keys(object);
        userIDs.forEach(uid => {
          firebase.database().ref(`users/${uid}/lobbyHistory/${roomId}`)
            .remove();
        });
      });
    this.deleteRoomFromLobby();
  }

  render() {
    const { navigation } = this.props;
    const roomName = navigation.getParam('roomName');
    const creatorName = navigation.getParam('creatorName');
    const roomId = navigation.getParam('roomId');
    const displayClosingTime = navigation.getParam('displayClosingTime');

    return (
      <ScrollView style={{ flex: 1 }}>
      <CardSection style={styles.buttonCardStyle}>
        <RoomButton
          buttonStyle={{ backgroundColor: '#f39c12' }}
          onPress={() => navigation.navigate('Menu', { roomId })}
        >
          <AwesomeIcon name='plus-circle' size={20} />
          {'\n'}
          FOOD
        </RoomButton>

        <RoomButton
          buttonStyle={{ backgroundColor: '#2980b9' }}
          onPress={() => call(args).catch(console.error)}
        >
          <AwesomeIcon name='phone' size={20} />
          {'\n'}
          AMEENS
        </RoomButton>

        <RoomButton
          buttonStyle={{ backgroundColor: '#2c3e50' }}
          onPress={() => this.placeOrder()}
        >
          <AwesomeIcon name='check-circle' size={20} />
          {'\n'}
          CLOSE ORDER
        </RoomButton>

        <RoomButton
          buttonStyle={{ backgroundColor: '#c0392b' }}
          onPress={() => this.deleteRoom()}
        >
          <AwesomeIcon name='times-circle' size={20} />
          {'\n'}
          DELETE
          {'\n'}
          ROOM
        </RoomButton>
      </CardSection>
        <CardSection style={{ justifyContent: 'center', paddingVertical: 10 }}>
          <Text style={styles.roomNameStyle}>
            {roomName}
          </Text>
        </CardSection>
        <CardSection>
          <Text style={styles.smallStyle}>
            created by
          </Text>
          <Text style={styles.bigStyle}>
            {creatorName}
          </Text>
        </CardSection>
        <CardSection>
          <Text style={styles.smallStyle}>
            closing at
          </Text>
          <Text style={styles.bigStyle}>
            {displayClosingTime}H
          </Text>
        </CardSection>
        <CardSection style={{ paddingBottom: 10, borderBottomWidth: 1 }}>
          <Text style={styles.smallStyle}>
            total cost
          </Text>
          <Text style={styles.bigOrangeStyle}>
            ${this.state.roomTotalPrice || 0}
          </Text>
        </CardSection>

        <View>
          <FlatList
            ListEmptyComponent={
              <Text style={{ alignSelf: 'center', marginVertical: 15 }}>
                No orders yet!
              </Text>
            }
            data={this.state.orders}
            renderItem={({ item }) => (
              <FoodListItem
                item={item}
                creatorName={creatorName}
              />
            )}
            keyExtractor={item => item.uid}
          />
        </View>

      </ScrollView>
    );
  }
}

const styles = {
  roomNameStyle: {
    fontSize: 36,
    color: 'black',
    fontWeight: '700',
    fontFamily: 'NunitoSans-Bold',
    alignSelf: 'flex-end',
    textDecorationLine: 'underline',
  },
  smallStyle: {
    color: '#95a5a6',
    fontSize: 14,
    paddingLeft: 20,
    fontFamily: 'NunitoSans-Bold',
  },
  bigStyle: {
    fontSize: 28,
    paddingLeft: 20,
    color: 'black',
    fontWeight: '700',
    fontFamily: 'NunitoSans-Bold',
    alignSelf: 'flex-end',
  },
  bigOrangeStyle: {
    fontSize: 28,
    paddingLeft: 20,
    color: '#f39c12',
    fontWeight: '700',
    fontFamily: 'NunitoSans-Bold',
    alignSelf: 'flex-end',
  },
  totalStyle: {
    fontSize: 30,
    fontFamily: 'NunitoSans-Bold',
    color: '#f39c12',
  },
  totalCardStyle: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  headerCardStyle: {
  }
};


export default Room;
