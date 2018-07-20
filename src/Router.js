import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Button } from 'react-native';
import IosIcon from 'react-native-vector-icons/Ionicons';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Login from './screens/Login';
import CreateAccount from './screens/CreateAccount';
import Lobby from './screens/Lobby';
import LobbyHistory from './screens/LobbyHistory';
import LobbyMoney from './screens/LobbyMoney';
import CreateRoom from './screens/CreateRoom';
import Room from './screens/Room';
import RoomHistory from './screens/RoomHistory';
import Menu from './screens/Menu';

export const LobbyStack = createStackNavigator({
  Lobby: {
    screen: Lobby,
    navigationOptions: ({ navigation }) => ({
      headerRight:
        <Button
          onPress={() => navigation.navigate('CreateRoom')}
          title="Create Room"
          color="red"
        />,
      title: 'Lobby',
      headerLeft: null
    }),
  },
  Room: {
    screen: Room,
    navigationOptions: {
      title: 'Room',
    }
  },
  CreateRoom: {
    screen: CreateRoom,
    navigationOptions: {
      title: 'Create Room',

    }
  },
  Menu: {
    screen: Menu,
    navigationOptions: {
      title: 'Menu',
    }
  },

});

export const LobbyHistoryStack = createStackNavigator({
  LobbyHistory: {
    screen: LobbyHistory,
    navigationOptions: { title: 'Lobby History' }
  },
  RoomHistory: {
    screen: RoomHistory,
    navigationOptions: { title: 'Rooms u r in' }
  },
  Menu: {
    screen: Menu,
    navigationOptions: {
      title: 'Menu',
    }
  },
});

export const LobbyMoneyStack = createStackNavigator({
  LobbyMoney: {
    screen: LobbyMoney,
    navigationOptions: { title: 'Money Status' }
  },
});

export const TabStack = createBottomTabNavigator({
  Lobby: {
    screen: LobbyStack,
    navigationOptions: {
      tabBarLabel: 'Lobby',
      tabBarIcon: ({ tintColor }) => (
        <IosIcon name='ios-home' color={tintColor} size={24} />
      )
    }
  },
  LobbyHistory: {
    screen: LobbyHistoryStack,
    navigationOptions: {
      tabBarLabel: 'Your Rooms',
      tabBarIcon: ({ tintColor }) => (
        <LineIcon name='user' color={tintColor} size={24} />
      )
    }
  },
  LobbyMoney: {
    screen: LobbyMoneyStack,
    navigationOptions: {
      tabBarLabel: 'Money Status',
      tabBarIcon: ({ tintColor }) => (
        <AwesomeIcon name='money' color={tintColor} size={24} />
      )
    }
  },
}, {

  // Tab router config
  initialRouteName: 'Lobby',
  tabBarOptions: {
    activeTintColor: 'orange',
    inactiveTintColor: 'grey'
  },
});

export const RootStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null  // No more header banner
    }
  },
  CreateAccount: {
    screen: CreateAccount,
    navigationOptions: {
      title: 'Create Account',
      headerStyle: { backgroundColor: '#F4F4F4' },
    }
  },
  Lobby: {
    screen: TabStack,
    navigationOptions: {
      header: null,
    }
  }
});
