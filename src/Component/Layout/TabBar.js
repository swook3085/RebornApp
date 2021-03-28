import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export function TabBar({ state, descriptors, navigation }) {
  return (
    <View style={{
      flexDirection: 'row', backgroundColor: "#ECB04D", height: 60, borderRadius: 15, margin: 10, justifyContent: "center", alignItems: "center", shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
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
            {label === 'home' && <Icon name="home" color={isFocused ? '#0a6fb7' : '#fff'} size={25} />}
            {label === 'Search' && <Icon name="search" color={isFocused ? '#0a6fb7' : '#fff'} size={25} />}
            {label === 'story' && <MaterialIcons name="article" color={isFocused ? '#0a6fb7' : '#fff'} size={25} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}