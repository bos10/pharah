import React, { Component } from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import { View, Text, Button, FlatList } from 'react-native';
import { CardSection } from '../components/common';
import FoodListItem from '../components/FoodListItem';

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
        const orders = _.map(snapshot.val(), (val, ordererName) => {
          return { ...val, ordererName };
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
    this.deleteRoomFromLobby();
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
      <View style={{ flex: 1 }}>
        <CardSection style={styles.cardSectionStyle}>
          <Text style={styles.roomNameStyle}>
            Welcome to {roomName}!
          </Text>
        </CardSection>
        <CardSection>
          <Text style={styles.roomNameStyle}>
            Created by {creatorName}, closing at {displayClosingTime}.
          </Text>
        </CardSection>
        <CardSection>
          <Button
            title="Add food"
            onPress={() => navigation.navigate('Menu', { roomId })}
          />
        </CardSection>

        <View>
          <FlatList
            data={this.state.orders}
            renderItem={({ item }) => (
              <FoodListItem
                item={item}
              />
            )}
            keyExtractor={item => item.ordererName}
          />
        </View>
        <CardSection>
          <Text style={styles.totalStyle}>Total : ${this.state.roomTotalPrice || 0}</Text>
        </CardSection>
        <CardSection style={{ alignItems: 'center' }}>
          <Button
            title="Order"
            onPress={() => this.placeOrder()}
          />
        </CardSection>
        <CardSection style={{ alignItems: 'center' }}>
          <Button
            title="DELETE"
            onPress={() => this.deleteRoom()}
          />
        </CardSection>
      </View>
    );
  }
}

const styles = {
  roomNameStyle: {
    fontSize: 18,
    paddingLeft: 25,
  },
  roomTimeStyle: {
    fontSize: 18,
    paddingLeft: 5,
    color: '#ef4836',
  },
  roomCreatorStyle: {
    fontSize: 11,
    paddingLeft: 5,
    alignSelf: 'flex-end',
  },
  cardSectionStyle: {
    padding: 20,
    borderBottomWidth: 2,
  },
  totalStyle: {
    fontSize: 30,
    fontWeight: '600',
    paddingLeft: 5,
    color: '#ef4836',
  }
};


export default Room;
