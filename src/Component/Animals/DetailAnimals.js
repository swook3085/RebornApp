import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar, Linking, Alert, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable'
import TouchableScale from 'react-native-touchable-scale';
import { dateFomat } from '../../Util/Util';
import TopNavigation from './TopNavigation';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const HEADER_MAX_HEIGHT  = 300;
const HEADER_MIN_HEIGHT  = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT  - HEADER_MIN_HEIGHT;
const DURATION = 400;

export default () => {
  const scrollA = React.useRef(new Animated.Value(0)).current;
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

  const imageOpacity = scrollA.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  const imageTransrateY = scrollA.interpolate({
    inputRange: [-HEADER_MAX_HEIGHT, 0, HEADER_MAX_HEIGHT, HEADER_MAX_HEIGHT + 1],
    outputRange: [-HEADER_MAX_HEIGHT / 2, 0, HEADER_MAX_HEIGHT * 0.75, HEADER_MAX_HEIGHT * 0.75],
  });
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
      <View>
        <TopNavigation title={item.noticeNo} scrollA={scrollA}/>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollA}}}],
            {useNativeDriver: true},
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.bannerContainer}>
            <SharedElement id={`item.${index}.image`} style={[{ width:'100%', height:HEADER_MAX_HEIGHT, backgroundColor: '#ECB04D' }]}>
              <Animated.Image
               resizeMode='cover'
                source={{ uri: item.popfile }}
                style={[styles.banner(scrollA)]}
              />
            </SharedElement>
          </View>
          <View style={{backgroundColor: '#fff',flex:1, borderTopLeftRadius:10, borderTopRightRadius:10,  marginTop: -10}}>
            <View style={{ justifyContent: 'center', margin:24 }} >
              <View style={{disply:'flex', flexDirection: 'row'}}>
                <Text>품종</Text>
                <Text>{item.kindCd.substring(item.kindCd.indexOf('[') + 1,item.kindCd.indexOf(']'))}</Text>
                <Text>{` > `}</Text>
                <Text>{item.kindCd.substring(item.kindCd.indexOf(']') + 2,item.kindCd.length)}</Text>
              </View>
              <Text>{item.sexCd === 'M' ? '수컷' : '암컷'}/{item.colorCd}/{item.age}/{item.weight}</Text>
            </View>
          <Text style={styles.text}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec
      semper turpis. Ut in fringilla nisl, sit amet aliquet urna. Donec
      sollicitudin libero sapien, ut accumsan justo venenatis et. Proin iaculis
      ac dolor eget malesuada. Cras commodo, diam id semper sodales, tortor leo
      suscipit leo, vitae dignissim velit turpis et diam. Proin tincidunt
      euismod elit, at porttitor justo maximus vel. Proin viverra, nibh non
      accumsan sollicitudin, arcu metus sagittis nunc, et tempor tellus ligula
      et justo. Pellentesque ultrices fermentum efficitur. Lorem ipsum dolor sit
      amet, consectetur adipiscing elit. Praesent nec convallis nisl, et rhoncus
      mauris. Morbi consequat sem tellus, in scelerisque lorem vehicula ut.
      {'\n\n'}Nam vel imperdiet massa. Donec aliquet turpis quis orci fermentum,
      eget egestas tellus suscipit. Sed commodo lectus ac augue mattis, a
      pulvinar metus venenatis. Vestibulum cursus rhoncus mauris, fringilla
      luctus risus eleifend ut. Vestibulum efficitur imperdiet scelerisque.
      Pellentesque sit amet lorem bibendum, congue dolor suscipit, bibendum est.
      Aenean leo nibh, varius vel felis nec, sagittis posuere nunc. Vestibulum
      ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia
      curae; Duis ullamcorper laoreet orci, ac tempus dui aliquet et. Morbi
      porta nisi sed augue vestibulum tristique. Donec nisi ligula, efficitur at
      arcu et, sagittis imperdiet urna. Sed sollicitudin nisi eget pulvinar
      ultricies. Ut sit amet dolor luctus massa dapibus tincidunt non posuere
      odio. Aliquam sit amet vehicula nisi.
    </Text>

          {/* <Animatable.View style={{ justifyContent: 'center', marginTop: 0, marginBottom: 10 }} animation='fadeInLeft' delay={DURATION + 1 * 200} >
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
          </Animatable.View> */}
          </View>
        </Animated.ScrollView>
        {/* <View style={[{
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
        </View> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginTop: -1000,
    paddingTop: 1000,
    alignItems: 'center',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
  },
  image: {

  },
  text: {
    margin: 24,
    fontSize: 16,
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

  },
  banner: scrollA => ({
    height: HEADER_MAX_HEIGHT,
    width: '100%',
    opacity : scrollA.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: scrollA.interpolate({
          inputRange: [-HEADER_MAX_HEIGHT, 0, HEADER_MAX_HEIGHT, HEADER_MAX_HEIGHT + 1],
          outputRange: [-HEADER_MAX_HEIGHT / 2, 0, HEADER_MAX_HEIGHT * 0.75, HEADER_MAX_HEIGHT * 0.75],
        }),
      },
    ],
  }),
});
