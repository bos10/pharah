import firebase from 'firebase';

import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import _ from 'lodash';
import LobbyHistoryListItem from '../components/LobbyHistoryListItem';

class LobbyHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyHistory: [],
    };
  }

  componentDidMount() {
    this.getLobby();
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

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ marginLeft: 5, marginRight: 5 }}>
          <FlatList
            ListEmptyComponent={
              <Text style={{ alignSelf: 'center', marginVertical: 15 }}>
                Lobby history is empty!
              </Text>
            }
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
