import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';
import LobbyHistoryListItem from '../components/LobbyHistoryListItem';
import { CardSection } from '../components/common';

class LobbyHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyHistory: [],
      time: '',
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
    const uid = firebase.auth().currentUser.uid;

    firebase.database().ref(`/users/${uid}/lobbyHistory/`)
      .on('value', snapshot => {
        const lobbyHistoryTaken = snapshot.val();
        // Make sure not null, Remove times attribute before mapping
        if (lobbyHistoryTaken === null) {
          return [];
        }
        // Map to get array of rooms, add on the uid
        // Each time fetch lobby, check each room if status need change
        const lobbyHistory = _.map(lobbyHistoryTaken, (val, roomId) => {
          return { ...val, roomId };
        });
        this.setState({ lobbyHistory });
      });
  }

  getTime() {
    // At every second, clock will compare with time array
    // Compare with arr[0], the next earliest timeout
    // If that time just passes, remove it and update its status to pending
    var nowDate = new Date();
    var nowString = nowDate.toString();

    this.setState({
      time: nowString
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View>
          <FlatList
            data={this.state.lobbyHistory}
            renderItem={({ item }) => (
              <LobbyHistoryListItem
                navigation={this.props.navigation}
                item={item}
              />)}
            keyExtractor={item => item.roomId}
          />
        </View>
      </View>
    );
  }
}

export default LobbyHistory;
