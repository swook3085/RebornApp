import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import OrganicAnimals from './OrganicAnimals';
import DetailAnimals from './Modal/DetailAnimals';

const SearchStack = createStackNavigator();

export default class SearChStack extends Component {
    render() {
        return (
            <SearchStack.Navigator>
                <SearchStack.Screen name="search" component={OrganicAnimals} options={{ headerShown: false }} />
                <SearchStack.Screen name="Details" component={DetailAnimals} options={{ headerShown: false }} />
            </SearchStack.Navigator>
        )
    }
}
