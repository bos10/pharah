import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';
import ListItem from '../components/ListItem';
import { Card, CardSection, LogoutButton } from '../components/common';

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
      <View style={styles.background}>
        <Card style={{ flexDirection: 'row' }}>
          <Text style={styles.titleText}>
          Available Rooms
          </Text>

          {/* Logout Button */}
          <CardSection style={styles.logOutContainer}>
            <LogoutButton
              onPress={() => this.props.navigation.navigate('Login')}
            >
            LOGOUT
            </LogoutButton>
          </CardSection>
        </Card>

        {/* Block */}
        <View style={{ backgroundColor: 'transparent', marginLeft: 5, marginRight: 5 }}>
          <FlatList
            ListEmptyComponent={
              <Text style={styles.lobbyDefaultText}>
                Oops! Looks like Lobby is empty!{'\n'}
                To start a jio, press 'Create Room'
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

        {/* Current Time */}
        <CardSection style={styles.currentTimeBanner}>

          <Text> {this.state.time} </Text>
        </CardSection>

      </View>
    );
  }
}

export default Lobby;

const styles = {
  background: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // This styling is overrides the styling in cardsection
  currentTimeBanner: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
    left: 0,
    right: 0,
  },

  logOutContainer: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'transparent',
  },

  lobbyDefaultText: {
    alignSelf: 'center',
    marginVertical: 15,
    justifyContent: 'center',
  },
  titleText: {
    fontWeight: '300',
    color: '#000',
  }


};
