import React, { Component } from 'react'
import { View,Text, Animated, TouchableOpacity } from 'react-native'
import Home from './Home';
import Story from './Story';
import Account from './Account';
import { NavigationContainer,getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { TabBar } from './Layout/TabBar';
import DetailAnimals from './Animals/DetailAnimals'
import OrganicAnimals from './Animals/OrganicAnimals'
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Header from './Layout/Header';
import { dateModalOpen } from '../Redux/Actions/Action';
import { connect } from 'react-redux';
import RebornContext from './Context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TransitionScreenOptions = {
    ...TransitionPresets.SlideFromRightIOS, // This is where the transition happens
  };
const SearchScreen = ({ navigation, route }) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideOnScreens = ['Details'];
    if(hideOnScreens.indexOf(routeName) > -1) {
        navigation.setOptions({ tabBarVisible: false })
    } else {
        navigation.setOptions({ tabBarVisible: true })
    }
    return (
        <SearchStack.Navigator 
            initialRouteName="Search" 
            screenOptions={TransitionScreenOptions}
        >
            <SearchStack.Screen name="Search" component={OrganicAnimals} options={{ headerShown: false }} />
            <SearchStack.Screen
                name="Details"
                component={DetailAnimals}
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                    headerBackTitleVisible: false,
                    // cardStyleInterpolator: ({ current: { progress } }) => {
                    //     return {
                    //         cardStyle: {
                    //             opacity: progress,
                    //         },
                    //     };
                    // },
                }}
                // collaspable={false}
                // sharedElementsConfig={(route, otherRoute, showing) => {
                //     const { item } = route.params;
                //     const { index } = route.params;
                //     return [
                //         { id: `item.${index}.image`, resize: 'clip' },
                //         // { id: `item.${index}.statebg`, resize: 'clip' },
                //         // { id: `item.${index}.stateTx`, resize: 'clip', animation: 'fade' },
                //         // { id: 'generate.bg', resize: 'clip', animation: 'fade' },

                //     ];
                // }}
            />
      </SearchStack.Navigator>
    );
}

const MyTabs = (props) => {
    const aniText = new Animated.Value(0);

    const textSize = aniText.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.2],
        extrapolate: 'clamp',
      });
    return (
        <>
            <Tab.Navigator 
                tabBarPosition='bottom' 
                tabBarOptions={{
                    iconStyle: {
                        marginTop:10
                    }
                }}
                screenOptions={(props) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        switch (props.route.name) {
                            case '홈':
                                return <Ionicons name={focused ? "home-sharp" : "home-outline"} color={focused ? '#3f434a' : '#a6a6a6'} size={20} />
                            case '검색':
                                return <Icon name="search" color={focused ? '#3f434a' : '#a6a6a6'} size={20} />
                            case '스토리':
                                return <MaterialIcons name="article" color={focused ? '#3f434a' : '#a6a6a6'} size={20} />
                            case 'MY':
                                return <Icon name={focused ? "user-alt" : "user"} color={focused ? '#3f434a' : '#a6a6a6'} size={20} />
                            default:
                                break;
                        }
                    },
                    tabBarLabel: ({ focused }) => {
                        return <Animated.Text style={{color: focused ? '#3f434a' : '#a6a6a6', fontSize: 10, transform:[{scale:focused ? textSize : 1 }], marginVertical:5, fontWeight:'600'}}>{props.route.name}</Animated.Text>
                    },
                })}>
                <Tab.Screen name="검색"  component={SearchScreen} />
                <Tab.Screen name="홈" component={Home} />
                <Tab.Screen name="스토리" component={Story} />
                <Tab.Screen name="MY" component={Account} />
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