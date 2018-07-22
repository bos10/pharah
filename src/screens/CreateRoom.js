import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import firebase from 'firebase';
import DateTimePicker from 'react-native-modal-datetime-picker';
import FCM from 'react-native-fcm';
import { Card, CardSection, Button, InputNoLabel } from '../components/common';

class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: '',
      roomName: '',
      displayClosingTime: '',
      ISOClosingTime: '',
      roomStatus: 'open',
      roomTotalPrice: 0,
      isDateTimePickerVisible: false,
    };
  }
  onButtonPress() {
    // Schedule a notif
    const cutDate = this.state.ISOClosingTime.slice(4, 33);
    FCM.scheduleLocalNotification({
      id: 'testnotif',
      fire_date: new Date(cutDate),
      vibrate: 300,
      sound: 'default',
      title: 'Closing time reached',
      body: 'Order food now!',
      priority: 'high',
      show_in_foreground: true,
      wake_screen: true,
    });

    // Dabase stuff
    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref(`users/${uid}/displayName/`)
      .once('value')
      .then(snapshot1 => {
        // Get the room creator's name from currentUser
        const creatorName = snapshot1.val();
        const { roomName,
                displayClosingTime,
                ISOClosingTime,
                roomStatus,
                roomTotalPrice } = this.state;
        // Push new room to lobby with the details
        const ref = firebase.database().ref('/lobby')
          .push({ creatorName,
                  creatorId: uid,
                  roomName,
                  displayClosingTime,
                  ISOClosingTime,
                  roomStatus,
                  roomTotalPrice });
        const roomId = ref.getKey();
        // Updating of times array to arrange timing
        // Each slot has timing & roomId
        firebase.database().ref('/lobby/times')
          .once('value')
          .then(snapshot2 => {
            // Retrieve current array of times
            var arr = snapshot2.val();
            if (arr === null) {
              // If null, just add this time
              arr = [{ ISOClosingTime, roomId }];
            } else {
              // Run through array, insert if adding time is smaller
              let i = 0;
              for (i; i < arr.length; i++) {
                const t = arr[i].ISOClosingTime;
                const addingDate = new Date(ISOClosingTime);
                const arrDate = new Date(t);
                if (addingDate < arrDate) {
                  // Insert, since smaller
                  arr.splice(i, 0, { ISOClosingTime, roomId });
                  break;
                }
              }
              if (i === arr.length) {
                // If still not added after break out loop
                // Add to end of array
                arr.push({ ISOClosingTime, roomId });
              }
            }
            // Update the array of times in database
            firebase.database().ref('/lobby')
              .update({ times: arr });
          });
    });

    this.props.navigation.goBack();
  }

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (date) => {
    // date is in UTC
    // Add 8 hrs coz SG is +8 UTC
    var dateString = date.toString().slice(16, 21);

    this.setState({
      displayClosingTime: dateString,
      ISOClosingTime: date.toString(),
    });

    this.hideDateTimePicker();
  };

  render() {
    return (
      <Card>

        <CardSection>
          <InputNoLabel
            placeholder="Room name here"
            value={this.state.roomName}
            onChangeText={text => this.setState({ roomName: text })}
          />
        </CardSection>

        <CardSection style={{ justifyContent: 'center', paddingVertical: 15 }}>
          <TouchableOpacity
            onPress={this.showDateTimePicker}
          >
            <Text style={{ fontSize: 18, color: 'blue' }}>Show DatePicker</Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode='datetime'
          />
        </CardSection>

        <CardSection>
          <Button onPress={this.onButtonPress.bind(this)}>
            create
          </Button>
        </CardSection>

      </Card>
    );
  }
}


export default CreateRoom;
