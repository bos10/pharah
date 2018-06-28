import React, { Component } from 'react';
import { View, FlatList, Text, Button } from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';
import ListItem from '../components/ListItem';
import { CardSection } from '../components/common';

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '',
      data: []
    };
  }

  componentDidMount() {
    this.Clock = setInterval(() => this.getTime(), 1000);
    this.getLobby();
  }

  componentWillUnmount() {
    clearInterval(this.Clock);
  }

  getLobby() {
    firebase.database().ref('/lobby')
      .on('value', snapshot => {
        const lobbyTaken = snapshot.val();
        // Make sure not null, Remove times attribute before mapping
        if (lobbyTaken === null) {
          return [];
        }
        delete lobbyTaken.times;
        // Map to get array of rooms, add on the uid
        // Each time fetch lobby, check each room if status need change
        const lobby = _.map(lobbyTaken, (val, roomId) => {
          const nowTime = this.state.time;
          const nowDateObj = new Date(nowTime);
          const itemTime = val.ISOClosingTime;
          const itemDateObj = new Date(itemTime);
          if (itemDateObj < nowDateObj) {
            firebase.database().ref(`/lobby/${roomId}`)
              .update({ roomStatus: 'pending' });
            return { ...val, roomId, roomStatus: 'pending' };
          }

          return { ...val, roomId, roomStatus: 'open' };
        });
        this.setState({ data: lobby });
      });
  }

  getTime() {
    // At every second, clock will compare with time array
    // Compare with arr[0], the next earliest timeout
    // If that time just passes, remove it and update its status to pending
    var nowDate = new Date();
    var nowString = nowDate.toString();
    firebase.database().ref('lobby/times/')
      .once('value')
      .then(snapshot1 => {
        if (snapshot1.val() != null) {
          const arr = snapshot1.val();
          const nextTime = arr[0].ISOClosingTime;
          const nextTimeId = arr[0].roomId;
          const arrDate = new Date(nextTime);
          if (arrDate < nowDate) {
            // Place lobby as pending in respective lobby histories
            firebase.database().ref(`lobby/${nextTimeId}/userIDs`)
              .once('value')
              .then(snapshot => {
                const object = snapshot.val();
                if (object === null) { return; }
                const userIDs = Object.keys(object);
                userIDs.forEach(uid => {
                  firebase.database().ref(`users/${uid}/lobbyHistory/${nextTimeId}`)
                    .update({ roomStatus: 'pending' });
                });
              });
            // Room as pending here in lobby
            firebase.database().ref(`/lobby/${nextTimeId}`)
              .update({ roomStatus: 'pending' });

            arr.shift();
            // Update the array of times in database
            firebase.database().ref('/lobby')
              .update({ times: arr });
          }
        }
      });

    this.setState({
      time: nowString
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View>
          <FlatList
            ListEmptyComponent={
              <Text style={{ alignSelf: 'center', marginVertical: 15 }}>
                Lobby is empty! Create a room above! ^
              </Text>
            }
            data={this.state.data}
            renderItem={({ item }) => (
              <ListItem
                navigation={this.props.navigation}
                item={item}
              />)}
            keyExtractor={item => item.roomId}
          />
        </View>

        <CardSection style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={{ marginVertical: 5, fontSize: 20 }}> Current Time </Text>
          <Text> {this.state.time} </Text>
        </CardSection>

        <CardSection style={{ alignItems: 'center' }}>
          <Button
            title="Logout"
            onPress={() => this.props.navigation.navigate('Login')}
          />
        </CardSection>

      </View>
    );
  }
}

export default Lobby;
