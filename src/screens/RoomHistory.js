import React, { Component } from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import { View, Text, Button, FlatList } from 'react-native';
import { CardSection } from '../components/common';
import FoodListItemRoomHistory from '../components/FoodListItemRoomHistory';

// Represents a Room from HistoryLobby
// Differs with Room coz it takes from firebase user's lobbys, not ~/lobby
// All functions will not appear if lobby status is closed

class RoomHistory extends Component {
  state = {
    orders: [],
    roomTotalPrice: 0,
    roomStatus: ''
  }

  componentDidMount() {
    const { navigation } = this.props;
    const roomId = navigation.getParam('roomId');
    const userid = firebase.auth().currentUser.uid;
    // Reference for Room's items, setstate
    firebase.database().ref(`users/${userid}/lobbyHistory/${roomId}/items/`)
      .on('value', snapshot => {
        const orders = _.map(snapshot.val(), (val, uid) => {
          return { ...val, uid };
        });
        this.setState({ orders });
      });

    // Reference for Room's total price, setstate
    firebase.database().ref(`users/${userid}/lobbyHistory/${roomId}/roomTotalPrice`)
      .on('value', snapshot => {
        this.setState({ roomTotalPrice: snapshot.val() });
      });

      // Reference for Room's status, setstate
      firebase.database().ref(`users/${userid}/lobbyHistory/${roomId}/roomStatus`)
        .on('value', snapshot => {
          this.setState({ roomStatus: snapshot.val() });
        });
  }

  renderAddFoodButton() {
    //const { navigation } = this.props;
    //const roomId = navigation.getParam('roomId');
    if (this.state.roomStatus !== 'closed') {
      return (
        <CardSection>
          <Text style={styles.moreStyle}> Go to Lobby to add food,delete, or order! </Text>
        </CardSection>
      );
    }
  }

  renderOrderButton() {
    if (this.state.roomStatus !== 'closed') {
      return (
        <CardSection style={{ alignItems: 'center' }}>
          <Button
            title="Order"
            onPress={() => this.placeOrder()}
          />
        </CardSection>
      );
    }
  }

  render() {
    const { navigation } = this.props;
    const roomName = navigation.getParam('roomName');
    const creatorName = navigation.getParam('creatorName');
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

        <View>
          <FlatList
            data={this.state.orders}
            renderItem={({ item }) => (
              <FoodListItemRoomHistory
                item={item}
                navigation={this.props.navigation}
                creatorName={creatorName}
                roomStatus={this.state.roomStatus}
              />
            )}
            keyExtractor={item => item.uid}
          />
        </View>
        <CardSection>
          <Text style={styles.totalStyle}>Total : ${this.state.roomTotalPrice || 0}</Text>
        </CardSection>

        {this.renderAddFoodButton()}
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
  },
  moreStyle: {
    fontSize: 18,
    color: 'blue',
  }
};


export default RoomHistory;
