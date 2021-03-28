import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity,Dimensions } from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {item} = route.params;
  const {index} = route.params;
  console.log(`width : ${item.width} ----------- height : ${item.height}`)
  var width = item.width * 0.5;
  var height = item.height * 0.5;
  if (item.height > 1200) {
    height = item.height * 0.2
  } else if (item.height > 900) {
    height = item.height * 0.4
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={{ color: '#000', fontSize: 18 }}>Back</Text>
      </TouchableOpacity>
      <SharedElement id={`item.${index}.image`} style={[{width, height}]}>
        <Image
          source={{uri: item.popfile}}
          resizeMode="cover"
          style={{width, height}}
        />
      </SharedElement>
      <View style={styles.bg} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center'
  },
  image: {
   
  },
  backButton: {
    position:'absolute',
    zIndex:10,
    width: 80,
    height: 50,
    top:20,
    left:0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
  },
  bg: {
    width: '100%',
    height:WINDOW_HEIGHT * 0.6,
    backgroundColor:'red',
  }
});
