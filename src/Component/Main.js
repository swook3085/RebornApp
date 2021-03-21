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

const Tab = createBottomTabNavigator();

export default class Main extends Component {
    render() {
        return (
            <>
                <Header/>
                <NavigationContainer>
                    <Tab.Navigator
                        tabBarOptions={{
                            showLabel : false
                        }}
                    >
                        <Tab.Screen 
                            name="home" 
                            component={Home} 
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                <Icon name="home" color={color} size={size}/>
                                ),

                            }}
                        />
                        <Tab.Screen 
                            name="search" 
                            component={OrganicAnimals} 
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                <Icon name="search" color={color} size={size}/>
                                ),

                            }}
                        />
                        <Tab.Screen 
                            name="story" 
                            component={Story} 
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <MaterialIcons name="article" color={color} size={size}/>
                                ),
                            }}
                        />
                    </Tab.Navigator>
                </NavigationContainer>
            </>
        )
    }
}
