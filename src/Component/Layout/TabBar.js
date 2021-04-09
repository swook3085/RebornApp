import React, { useState } from 'react'
import { Text, View, TouchableOpacity, StatusBar, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated from 'react-native-reanimated';

export function TabBar({ state, descriptors, navigation, position }) {
  const [translateValue] = useState(new Animated.Value(0));
  const totalWidth = Dimensions.get("window").width - 20;
  const tabWidth = totalWidth / state.routes.length;
  var inputRange, late;
  state.routes.map((route, index) => {
    inputRange = state.routes.map((_, i) => i);
    late = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(i => (i === index ? i * tabWidth : i * tabWidth)),
    });
  })
  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row', backgroundColor: "#ECB04D", height: 60, borderRadius: 15, margin: 10, marginBottom: StatusBar.currentHeight, justifyContent: "center", alignItems: "center", shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
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
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          Animated.spring(translateValue, {
            toValue: index * tabWidth,
            velocity: 10,
            useNativeDriver: true,
          }).start();
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
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
          </TouchableOpacity>
        );
      })}
    </View>
  );
}