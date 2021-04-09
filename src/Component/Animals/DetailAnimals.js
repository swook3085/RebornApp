import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar, Linking, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable'
import TouchableScale from 'react-native-touchable-scale';
import { dateFomat } from '../../Util/Util';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const DURATION = 400;

export default () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;
  const { index } = route.params;
  var width = item.width * 0.45;
  var height = item.height * 0.45;

  if (width > WINDOW_WIDTH) {
    width = WINDOW_WIDTH;
  }
  if (height > 300) {
    height = 300;
  }

  const goAlert = () =>
    Alert.alert(
      '',
      `${item.careNm}로 문의하겠습니까?`,
      [
        {
          text: "아니요",
          onPress: () => console.log("cancle"),
          style: "cancel"
        },
        { text: "네", onPress: onCallPress },
      ],
      { cancelable: false }
    );
  const onCallPress = () => Linking.openURL(`tel:${item.careTel}`);
  return (
    <>
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
          <View style={{ width: WINDOW_WIDTH, height: 40, position: 'absolute', backgroundColor: '#000', opacity: 0.4, top: -40 }} />
        </SharedElement>
        <SharedElement id={`item.${index}.stateTx`} style={{ color: '#fff', position: 'absolute', width: 120, top: height + 62.5, fontSize: 18 }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18 }}>{item.processState}</Text>
        </SharedElement>
        <View style={[{
          height: WINDOW_HEIGHT - (height + 130), top: height + 96.5
        }, styles.descBg]} />
        <View style={[{
          height: WINDOW_HEIGHT - (height + 130), top: height + 96.5
        }, styles.bg]}>
          <Animatable.View style={{ justifyContent: 'center', marginTop: 0, marginBottom: 10 }} animation='fadeInLeft' delay={DURATION + 1 * 200} >
            <Text style={{ fontSize: 20 }}>{item.kindCd}</Text>
            <Text>{item.sexCd === 'M' ? '수컷' : '암컷'}/{item.colorCd}/{item.age}/{item.weight}</Text>
          </Animatable.View>
          <Animatable.View animation='fadeInUp' delay={DURATION + 1 * 200} style={{ marginBottom: 5 }}>
            <Text style={styles.notiTitle}>공고번호</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'gold', marginRight: 10 }} />
              <Text style={{ fontSize: 15 }}>{item.noticeNo}</Text>
            </View>
          </Animatable.View>
          <Animatable.View animation='fadeInUp' delay={DURATION + 2 * 200} style={{ marginBottom: 5 }}>
            <Text style={styles.notiTitle}>공고기간</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'gold', marginRight: 10 }} />
              <Text style={{ fontSize: 15 }}>{`${dateFomat(item.noticeSdt.toString())} ~ ${dateFomat(item.noticeEdt.toString())}`}</Text>
            </View>
          </Animatable.View>
          <Animatable.View animation='fadeInUp' delay={DURATION + 3 * 200} style={{ marginBottom: 5 }}>
            <Text style={styles.notiTitle}>발견장소</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'gold', marginRight: 10 }} />
              <Text style={{ fontSize: 15 }}>{item.happenPlace}</Text>
            </View>
          </Animatable.View>
          <Animatable.View animation='fadeInUp' delay={DURATION + 4 * 200} style={{ marginBottom: 5 }}>
            <Text style={styles.notiTitle}>특이사항</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'gold', marginRight: 10 }} />
              <Text style={{ fontSize: 14 }}>{item.specialMark}</Text>
            </View>
          </Animatable.View>
          <Animatable.View animation='fadeInUp' delay={DURATION + 5 * 200} style={{ marginBottom: 5 }}>
            <Text style={styles.notiTitle}>보호센터</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'gold', marginRight: 10 }} />
              <Text style={{ fontSize: 14 }}>{item.careNm} {`(Tel : ${item.careTel})`}</Text>
            </View>
          </Animatable.View>
        </View>
      </View >
      <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, height: WINDOW_HEIGHT - (WINDOW_HEIGHT - (50 + StatusBar.currentHeight)), backgroundColor: "#f4f6fc" }}>
        <View style={{ flex: 1, height: 50 }}>
          <TouchableScale activeScale={0.9} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f4f6fc", borderWidth: 1, borderColor: '#ECB04D', borderRadius: 5, marginRight: 10 }}>
            <Text style={{ color: '#000' }}>공유</Text>
          </TouchableScale>
        </View>
        <View style={{ flex: 1, height: 50 }}>
          <TouchableScale activeScale={0.9} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#ECB04D", borderWidth: 1, borderColor: '#ECB04D', borderRadius: 5, marginLeft: 10 }}
            onPress={goAlert}>
            <Text style={{ color: '#fff' }}>문의</Text>
          </TouchableScale>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
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
    padding: 20,
    paddingRight: 30,
    backgroundColor: '#f4f6fc',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  descBg: {
    position: 'absolute',
    width: '100%',
    padding: 20,
    backgroundColor: '#000',
    opacity: 0.6
  },
  notiTitle: {
    fontSize: 16,
    fontWeight: '700',

  }
});
