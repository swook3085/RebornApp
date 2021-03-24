import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Header from './Header';
import OrganicAnimals from './OrganicAnimals';
import Story from './Story';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TabBar} from './TabBar';

const Tab = createBottomTabNavigator();

export default class Main extends Component {
    render() {
        return (
            <>
                <Header/>
                <NavigationContainer>
                    <Tab.Navigator tabBar={props => <TabBar {...props} />}>
                        <Tab.Screen name="home" component={Home}/>
                        <Tab.Screen name="search" component={OrganicAnimals}/>
                        <Tab.Screen name="story" component={Story}/>
                    </Tab.Navigator>
                </NavigationContainer>
            </>
        )
    }
}
