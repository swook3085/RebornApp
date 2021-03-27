import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import OrganicAnimals from './OrganicAnimals';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { NavigationContainer } from '@react-navigation/native';
import { DetailScreen } from './Modal/DetailAnimals';

const Stack = createSharedElementStackNavigator();

export default class SearChStack extends Component {
    render() {
        return (
            <>
                <Stack.Navigator>
                    <Stack.Screen name="Search" component={OrganicAnimals} options={{ headerShown: false }} />
                    <Stack.Screen name="Details" component={DetailScreen} options={{ headerShown: false, gestureEnabled : false }}  />
                </Stack.Navigator>
            </>
        )
    }
}
