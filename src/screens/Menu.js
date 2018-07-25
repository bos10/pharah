import React, { Component } from 'react';
import { Card, CardSection, RoomButton } from '../components/common';

class Menu extends Component {


  render() {
    const { navigation } = this.props;
    const roomId = navigation.getParam('roomId');

    return (
      <Card>
        {/*Thai*/}
        <CardSection>
          <RoomButton
            buttonStyle={{ backgroundColor: '#FFF',
                          borderRadius: 4,
                          borderWidth: 2,
                          borderColor: 'transparent'
                      }}
            textStyle={{ color: '#ff7c00' }}
            onPress={() => navigation.navigate('ThaiKitchen', { roomId })}
          >
            Thai
          </RoomButton>
        </CardSection>

        {/*Western*/}
        <CardSection>
          <RoomButton
            buttonStyle={{ backgroundColor: '#FFF',
                          borderRadius: 4,
                          borderWidth: 2,
                          borderColor: 'transparent'
                      }}
            textStyle={{ color: '#ff7c00' }}
            onPress={() => navigation.navigate('WesternKitchen', { roomId })}
          >
            Western
          </RoomButton>
        </CardSection>

        {/*Indian*/}
        <CardSection>
          <RoomButton
            buttonStyle={{ backgroundColor: '#FFF',
                            borderRadius: 4,
                            borderWidth: 2,
                            borderColor: 'transparent'
                        }}
            textStyle={{ color: '#ff7c00' }}
            onPress={() => navigation.navigate('IndianKitchen', { roomId })}
          >
            Indian
          </RoomButton>
        </CardSection>

        {/*Drinks*/}
        <CardSection>
          <RoomButton
            buttonStyle={{ backgroundColor: '#FFF',
                            borderRadius: 4,
                            borderWidth: 2,
                            borderColor: 'transparent'
                        }}
            textStyle={{ color: '#ff7c00' }}
            onPress={() => navigation.navigate('Drinks', { roomId })}
          >
            Drinks
          </RoomButton>
        </CardSection>

        {/*Desert*/}
        <CardSection>
          <RoomButton
            buttonStyle={{ backgroundColor: '#FFF',
                            borderRadius: 4,
                            borderWidth: 2,
                            borderColor: 'transparent'
                        }}
            textStyle={{ color: '#ff7c00' }}
            onPress={() => navigation.navigate('Desert', { roomId })}
          >
            Desert
          </RoomButton>
        </CardSection>
      </Card>
    );
  }
}

export default Menu;
