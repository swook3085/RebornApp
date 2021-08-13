import React, { useState } from 'react'
import { Text, View, TouchableOpacity, StatusBar, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated from 'react-native-reanimated';
import RebornContext from '../Context';

export const TabBar = (props) => {
  const { screen, setScreen } = React.useContext(RebornContext)
  const [translateValue] = useState(new Animated.Value(0));
  const totalWidth = Dimensions.get("window").width;
  const tabWidth = totalWidth / props.state.routes.length;
  var inputRange, late;
  props.state.routes.map((route, index) => {
    inputRange = props.state.routes.map((_, i) => i);
    late = Animated.interpolate(props.position, {
      inputRange,
      outputRange: inputRange.map(i => (i === index ? i * tabWidth : i * tabWidth)),
    });
  })
  return (
    <>
    <View style={{
      flexDirection: 'row', backgroundColor: "#ECB04D", height: 60, borderTopLeftRadius: 15,borderTopRightRadius:15,  justifyContent: "center", alignItems: "center", display:screen > 0 ? 'none' : 'flex'}}>
      <Animated.View style={{
        height: 40,
        position: "absolute",
        top: 10,
        left: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: 50,
        transform: [{ translateX: late }],
        width: tabWidth - 40,
      }} />
      {props.state.routes.map((route, index) => {
        const { options } = props.descriptors[route.key];
        options.tabBarVisible = false;
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;
        const isFocused = props.state.index === index;

        const onPress = () => {
          const event = props.navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          Animated.spring(translateValue, {
            toValue: index * tabWidth,
            velocity: 10,
            useNativeDriver: true,
          }).start();
          if (!isFocused && !event.defaultPrevented) {
            props.navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          props.navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: "center" }}
          >
            {label === 'home' && <Icon name="home" color={isFocused ? '#ECB04D' : '#fff'} size={25} />}
            {label === 'Search' && <Icon name="search" color={isFocused ? '#ECB04D' : '#fff'} size={25} />}
            {label === 'story' && <MaterialIcons name="article" color={isFocused ? '#ECB04D' : '#fff'} size={25} />}
            {label === 'account' && <Icon name="user" color={isFocused ? '#ECB04D' : '#fff'} size={25} />}
          </TouchableOpacity>
        );
      })}
    </View>
    <View style={{backgroundColor: "#ECB04D", height:StatusBar.currentHeight, display:screen > 0 ? 'none' : 'flex'}}/>
    </>
  );
}