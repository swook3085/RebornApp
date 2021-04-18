import React, { Component } from 'react'
import { View } from 'react-native'
import Home from './Home';
import Story from './Story';
import { NavigationContainer } from '@react-navigation/native';
import { TabBar } from './Layout/TabBar';
import DetailAnimals from './Animals/DetailAnimals'
import OrganicAnimals from './Animals/OrganicAnimals'
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from './Layout/Header';
import { dateModalOpen } from '../Redux/Actions/Action';
import { connect } from 'react-redux';

const Stack = createSharedElementStackNavigator();
const Tab = createMaterialTopTabNavigator();

function MyTabs() {
    return (
        <>
            <Header />
            <Tab.Navigator tabBar={props => <TabBar {...props} />} tabBarPosition='bottom'>
                <Tab.Screen name="Search" component={OrganicAnimals} />
                <Tab.Screen name="home" component={Home} />
                <Tab.Screen name="story" component={Story} />
            </Tab.Navigator>
        </>
    );
}

class Main extends Component {
    render() {
        return (
            <>
                <View style={{
                    flex: 1,
                    backgroundColor: '#f4f6fc',
                }}>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName="Tabs">
                            <Stack.Screen name="Tabs" component={MyTabs} options={{ headerShown: false }} />
                            <Stack.Screen
                                name="Details"
                                component={DetailAnimals}
                                options={navigation => ({
                                    headerShown: false,
                                    gestureEnabled: false,
                                    headerBackTitleVisible: false,
                                    cardStyleInterpolator: ({ current: { progress } }) => {
                                        return {
                                            cardStyle: {
                                                opacity: progress,
                                            },
                                        };
                                    },
                                })}
                                collaspable={false}
                                sharedElementsConfig={(route, otherRoute, showing) => {
                                    const { item } = route.params;
                                    const { index } = route.params;
                                    return [
                                        { id: `item.${index}.image`, resize: 'clip' },
                                        { id: `item.${index}.statebg`, resize: 'clip' },
                                        { id: `item.${index}.stateTx`, resize: 'clip', animation: 'fade' },
                                        // { id: 'generate.bg', resize: 'clip', animation: 'fade' },

                                    ];
                                }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
      store: state
    };
}
const mapDispatchToProps = (dispatch) => {
// return bindActionCreators(actions, dispatch);
    return {
        dateModalOpen: (dateOpen) => {
            return dispatch(dateModalOpen(dateOpen))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);