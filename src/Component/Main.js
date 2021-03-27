import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Header from './Header';
import Detail from './Modal/DetailAnimals';
import Story from './Story';
import { NavigationContainer } from '@react-navigation/native';
import { TabBar } from './TabBar';
import SearChStack from './SearchStack';

const Tab = createBottomTabNavigator();

export default class Main extends Component {
    render() {
        return (
            <>
                <View style={{ flex: 1, backgroundColor: '#f4f6fc' }}>
                    <Header />
                    <NavigationContainer>
                        <Tab.Navigator tabBar={props => <TabBar {...props} />} >
                            <Tab.Screen name="home" component={Home} />
                            <Tab.Screen name="Search" component={SearChStack} />
                            <Tab.Screen name="story" component={Story} />
                        </Tab.Navigator>
                    </NavigationContainer>
                </View>
            </>
        )
    }
}
