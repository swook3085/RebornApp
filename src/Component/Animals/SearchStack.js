import React from 'react';
import 'react-native-gesture-handler';
import DetailAnimals from './DetailAnimals';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import OrganicAnimals from './OrganicAnimals';

const Stack = createSharedElementStackNavigator();

const SearchStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen
          name="Search"
          component={OrganicAnimals}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Details"
          component={DetailAnimals}
          options={navigation => ({
            headerShown: false,
            gestureEnabled : false,
            headerBackTitleVisible: false,
            cardStyleInterpolator: ({current: {progress}}) => {
              return {
                cardStyle: {
                  opacity: progress,
                },
              };
            },
          })}
          collaspable = {false}
          sharedElementsConfig={(route, otherRoute, showing) => {
            const {item} = route.params;
            const {index} = route.params;
            return [
              {id:`item.${index}.image`, resize: 'clip'},
              'generate.bg'
            ];
          }}
        />
      </Stack.Navigator>
  );
};

export default SearchStack;
