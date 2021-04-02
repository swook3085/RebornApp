import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;
  const { index } = route.params;
  console.log(`width : ${item.width} ----------- height : ${item.height}`)
  var width = item.width * 0.5;
  var height = item.height * 0.5;

  if (width > WINDOW_WIDTH) {
    width = WINDOW_WIDTH;
  }
  if (height > 350) {
    height = 350;
  }

  // if (width.height > 1000) {
  //   width = item.width * 0.4
  // } else if (item.width > 900) {
  //   width = item.width * 0.3
  // } else if (item.width > 700) {
  //   width = item.width * 0.3
  // }
  // if (item.height > 1300) {
  //   height = item.height * 0.30
  // } else if (item.height > 900) {
  //   height = item.height * 0.4
  // }
  // if (item.width > 700 && item.height > 700) {
  //   height = item.height * 0.3;
  //   width = item.width * 0.3;
  // }
  // if (item.width >= 500 && item.height >= 1200) {
  //   height = item.height * 0.25;
  //   width = item.width * 0.3;
  // }
  // if (item.width > 1200 && item.height > 1500) {
  //   height = item.height * 0.2;
  //   width = item.width * 0.2;
  // }
  // if (item.width < 500 && item.height < 500) {
  //   height = item.height * 1.1;
  //   width = item.width * 1.1;
  // }
  // if (item.width < 700 && item.height < 500) {
  //   height = item.height * 0.8;
  //   width = item.width * 0.8;
  // }

  return (
    <View style={styles.container}>
      <View style={[{
        height: 70, width: '100%', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
      }]}>
        <TouchableOpacity activeOpacity={1} onPress={() => navigation.goBack()} style={[styles.backButton]}>
          <MaterialIcons name="arrow-back-ios" color={'#000'} size={25} />
          {/* <Text style={{ color: '#000', fontSize: 18 }}>Back</Text> */}
        </TouchableOpacity>
        <View style={[{ height: 70, flexDirection: 'row', flex: 1, alignItems: 'center' }]}>
          <Text style={{ textAlign: 'center', width: '100%', fontSize: 16, fontWeight: '600' }}>{item.noticeNo}</Text>
        </View>
      </View>
      <SharedElement id={`item.${index}.image`} style={[{ width, height, backgroundColor: '#fff' }]}>
        <Image
          source={{ uri: item.popfile }}
          resizeMode="cover"
          style={{ width, height }}
        />
      </SharedElement>
      <SharedElement id={`item.${index}.statebg`} style={{ width: WINDOW_WIDTH }}>
        <View style={{ width: WINDOW_WIDTH, height: 90, position: 'absolute', backgroundColor: '#000', opacity: 0.4, top: -70 }} />
      </SharedElement>
      <SharedElement id={`item.${index}.stateTx`} style={{ color: '#fff', position: 'absolute', left: WINDOW_WIDTH / 2, marginLeft: - 60, width: 120, top: height + 40, fontSize: 18 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18 }}>{item.processState}</Text>
      </SharedElement>
      <SharedElement id={`generate.bg`} style={[{
        height: WINDOW_HEIGHT - (height + 130), top: height + 85
      }, styles.bg]} >
        <View style={[{ height: WINDOW_HEIGHT - (height + 130), backgroundColor: '#f4f6fc', borderTopLeftRadius: 16, borderTopRightRadius: 16, }]} />
      </SharedElement>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight
  },
  image: {

  },
  backButton: {
    position: 'absolute',
    zIndex: 10,
    width: 60,
    height: 40,
    left: 0,
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
    position: 'absolute',
    width: '100%',
    backgroundColor: '#f4f6fc',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  }
});
