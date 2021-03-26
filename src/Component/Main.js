import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Header from './Header';
import SearChStack from './SearchStack';
import Detail from './Modal/DetailAnimals';
import Story from './Story';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TabBar } from './TabBar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default class Main extends Component {
    render() {
        return (
            <>
                <View style={{ flex: 1, backgroundColor: '#f4f6fc' }}>
                    <Header />
                    <NavigationContainer>
                        <Tab.Navigator tabBar={props => <TabBar {...props} />} >
                            <Tab.Screen name="home" component={Home} />
                            <Tab.Screen name="search" component={SearChStack} />
                            <Tab.Screen name="story" component={Story} />
                        </Tab.Navigator>
                    </NavigationContainer>
                </View>
            </>
        )
    }
}
