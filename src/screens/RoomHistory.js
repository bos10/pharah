import React, { Component } from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import { View, Text, FlatList, TextInput, Alert } from 'react-native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { CardSection, RoomButton } from '../components/common';
import FoodListItemRoomHistory from '../components/FoodListItemRoomHistory';

// Represents a Room from HistoryLobby
// Differs with Room coz it takes from firebase user's lobbys, not ~/lobby
// All functions will not appear if lobby status is closed

class RoomHistory extends Component {
  state = {
    orders: [],
    roomTotalPrice: 0,
    roomStatus: '',
    destination: '',
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
          <Text style={styles.moreStyle}>
            Go to Lobby to add food,delete, or order!
          </Text>
        </CardSection>
      );
    }
  }

  renderNotify() {
    if (this.state.roomStatus === 'closed') {
      return (
        <CardSection>
          <TextInput
            style={{ padding: 10, flex: 3 }}
            placeholder={'Notify food arrival'}
            onChangeText={text => this.setState({ destination: text })}
            value={this.state.destination}
          />
          <RoomButton
            buttonStyle={{ backgroundColor: '#f39c12', flex: 1 }}
            onPress={() => this.notify()}
          >
            <AwesomeIcon name='send' size={20} />
            {'\n'}
            NOTIFY
          </RoomButton>
        </CardSection>
      );
    }
  }

  notify() {
    const { navigation } = this.props;
    const roomId = navigation.getParam('roomId');
    const userid = firebase.auth().currentUser.uid;
    // Reference for Room's items, setstate
    firebase.database().ref(`users/${userid}/lobbyHistory/${roomId}/tokenIDs/`)
      .on('value', snapshot => {
        const obj = snapshot.val();
        if (obj === null) {
          Alert.alert('No Users to send to!(no tokens)');
          return;
        }
        const tokenArray = Object.keys(obj);
        const destination = this.state.destination;
        // Push tokenarry and destination into notification
        // Triggers cloud function
        firebase.database().ref('notify')
          .push({ tokenArray, destination });
      });
  }

  render() {
    const { navigation } = this.props;
    const numberOfIDs = navigation.getParam('numberOfIDs');
    const roomName = navigation.getParam('roomName');
    const creatorName = navigation.getParam('creatorName');
    const displayClosingTime = navigation.getParam('displayClosingTime');
    var totalCostWithDelivery = (Number(this.state.roomTotalPrice) + Number(4)).toFixed(2);
    return (
      <View style={{ flex: 1 }}>
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
        <CardSection style={{ paddingBottom: 10 }}>
          <Text style={styles.smallStyle}>
            total cost
          </Text>
          <Text style={{ paddingLeft: 20 }}>
            <Text style={styles.totalCostFrontStyle}>{this.state.roomTotalPrice || 0}+4 = </Text>
            <Text style={styles.bigOrangeStyle}>${totalCostWithDelivery}</Text>
          </Text>
        </CardSection>
        {this.renderNotify()}
        <View>
          <FlatList
            ListEmptyComponent={
              <Text style={{ alignSelf: 'center', marginVertical: 15 }}>
                No orders yet!
              </Text>
            }
            data={this.state.orders}
            renderItem={({ item }) => (
              <FoodListItemRoomHistory
                item={item}
                navigation={this.props.navigation}
                creatorName={creatorName}
                numberOfIDs={numberOfIDs}
                roomStatus={this.state.roomStatus}
              />
            )}
            keyExtractor={item => item.uid}
          />
        </View>
        {this.renderAddFoodButton()}
      </View>
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
  },
  totalCostFrontStyle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'NunitoSans-Bold',
  },
  totalCardStyle: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  buttonCardStyle: {
    paddingVertical: 5
  },
  moreStyle: {
    marginVertical: 10,
    fontSize: 18,
    color: 'black',
  }
};


export default RoomHistory;
