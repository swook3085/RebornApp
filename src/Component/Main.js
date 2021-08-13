import React, { Component } from 'react'
import { View } from 'react-native'
import Home from './Home';
import Story from './Story';
import Account from './Account';
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
import RebornContext from './Context';

const SearchStack = createSharedElementStackNavigator();
const Tab = createMaterialTopTabNavigator();

const SearchScreen = ({ navigation }) => {
    const { screen, setScreen } = React.useContext(RebornContext)
    if (screen == 0) {
        navigation.setOptions({ tabBarVisible: true })
    } else {
        navigation.setOptions({ tabBarVisible: false })
    }
    return (
        <SearchStack.Navigator initialRouteName="Search">
            <SearchStack.Screen name="Search" component={OrganicAnimals} options={{ headerShown: false }} />
            <SearchStack.Screen
                name="Details"
                component={DetailAnimals}
                options={route => ({
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
                // collaspable={false}
                sharedElementsConfig={(route, otherRoute, showing) => {
                    const { item } = route.params;
                    const { index } = route.params;
                    return [
                        { id: `item.${index}.image`, resize: 'clip' },
                        // { id: `item.${index}.statebg`, resize: 'clip' },
                        // { id: `item.${index}.stateTx`, resize: 'clip', animation: 'fade' },
                        // { id: 'generate.bg', resize: 'clip', animation: 'fade' },

                    ];
                }}
            />
      </SearchStack.Navigator>
    );
}

// import { useNavigationState } from '@react-navigation/native';
const MyTabs = (props) => {
    return (
        <>
            <Tab.Navigator tabBar={props => <TabBar {...props} />} tabBarPosition='bottom'>
                <Tab.Screen name="Search" component={SearchScreen} 
                />
                <Tab.Screen name="home" component={Home} />
                <Tab.Screen name="story" component={Story} />
                <Tab.Screen name="account" component={Account} />
            </Tab.Navigator>
        </>
    );
}

const Main = () => {
    const [screen, setScreen] = React.useState(0);
    return (
        <RebornContext.Provider value={{ screen, setScreen }}>
            <NavigationContainer>
                <MyTabs/>
            </NavigationContainer>
        </RebornContext.Provider>
    )
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