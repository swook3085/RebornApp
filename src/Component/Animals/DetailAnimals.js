import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Linking,
  Alert,
  Animated,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
// import { SharedElement } from 'react-navigation-shared-element';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TopNavigation from './TopNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeArea } from 'react-native-safe-area-context';
import ImageViewer from 'react-native-image-zoom-viewer';
import NaverMapView, { Marker } from 'react-native-nmap';
import axios from 'axios';
import {} from 'react-native-geocoder';
import { dateFomat } from '../../Util/Util';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default () => {
  const [state, setState] = React.useState({
    open: false,
    index: 0,
  });
  const [loaction, setLocation] = React.useState({ latitude: 0.0, longitude: 0.0 });
  const safeArea = useSafeArea();
  const insets = useSafeAreaInsets();
  const scrollA = React.useRef(new Animated.Value(0)).current;
  const route = useRoute();
  const { item, sido, sigungu } = route.params;
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
          text: '아니요',
          onPress: () => console.log('cancle'),
          style: 'cancel',
        },
        { text: '네', onPress: onCallPress },
      ],
      { cancelable: false },
    );
  const onCallPress = () => Linking.openURL(`tel:${item.careTel}`);

  const setCareAddrLocation = () => {
    const url = 'http://api.vworld.kr/req/address';
    const apiKey = '592D21FB-DAE3-3393-8E06-B48A77A5207A';
    axios
      .get(
        `${url}?service=address&request=getcoord&version=2.0&crs=epsg:4326&address=${
          item.careAddr
        }&refine=true&simple=true&format=json&type=road&key=${apiKey}`,
      )
      .then(res => {
        const { status, data } = res;
        if (status === 200) {
          const { response } = data;
          if (data && response && response.status === 'OK') {
            const { x, y } = response.result.point;
            setLocation({
              latitude: parseFloat(y),
              longitude: parseFloat(x),
            });
          }
        }
      });
  };
  React.useEffect(() => {
    setCareAddrLocation();
  }, []);
  const noticeNoArray = item.noticeNo.split('-');
  console.log(sido.filter(sd => sd.label.indexOf(noticeNoArray[0]) > -1));
  console.log(sigungu.filter(sg => sg.label.indexOf(noticeNoArray[1]) > -1));
  const suggEvent = () => {
    // 유기동물 조회
    _getAnimalData = async () => {
      var data = await this.animalValid();
      console.log(data);
      await axios
        .get(
          `${SERVICE_URL}abandonmentPublic?upkind=${data.upkind}&kind=${data.kind}&upr_cd=${
            data.sidoorgCd
          }&org_cd=${data.sigunguorgCd}&bgnde=${data.startDate}&endde=${
            data.endDate
          }&state=notice&pageNo=${data.page}&numOfRows=20&serviceKey=${SERVICE_KEY}`,
        )
        .then(res => {
          console.log(res.data.response.body);
          if (
            res.status === 200 &&
            !isEmptyValid(res.data.response.body) &&
            !isEmptyValid(res.data.response.body.items) &&
            !isEmptyValid(res.data.response.body.items.item)
          ) {
            this.setState({
              animalData: this.state.animalData.concat(res.data.response.body.items.item),
              page: this.state.page + 1,
              refreshing: false,
            });
            res.data.response.body.items.item.map(item => {
              console.log(
                this.state.sidoDataBody.items.item.filter(
                  sido => item.careAddr.indexOf(sido.orgdownNm) > -1,
                ),
              );
              console.log(
                this.state.sigunguDataBody.items.item.filter(
                  sigungu => item.careAddr.indexOf(sigungu.orgdownNm) > -1,
                ),
              );
              Image.getSize(item.popfile, (width, height) => {
                item.width = width;
                item.height = height;
                // console.log(`width : ${width}  -------------- height : ${height}`)
              });
            });
          }
        });
      this.RBSheet.close();
    };
  };
  return (
    <>
      <View style={{ paddingBottom: insets.bottom }}>
        {!state.open && <TopNavigation title={item.noticeNo} scrollA={scrollA} />}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollA } } }], {
            useNativeDriver: true,
          })}
          scrollEventThrottle={16}
        >
          <View style={styles.bannerContainer}>
            {/* <SharedElement id={`item.${index}.image`} style={[{ width:'100%', height:HEADER_MAX_HEIGHT, backgroundColor: '#ECB04D' }]}> */}
            <Animated.View style={[styles.banner(scrollA)]}>
              {/* <ImageModal
              resizeMode="contain"
              imageBackgroundColor="#000000"
              style={{
                height: HEADER_MAX_HEIGHT,
                width: Dimensions.get('window').width,
              }}
              modalImageStyle={{
                height: HEADER_MAX_HEIGHT,
                width: Dimensions.get('window').width,
              }}
              source={{ uri: item.popfile }}
          /> */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setState({ ...state, open: true })}
              >
                <Image
                  resizeMode="cover"
                  source={{ uri: item.popfile }}
                  style={{
                    height: HEADER_MAX_HEIGHT,
                    width: '100%',
                  }}
                />
              </TouchableOpacity>
            </Animated.View>
            {/* </SharedElement> */}
          </View>
          <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <View style={styles.noticeBanner}>
              <View style={styles.noticeBannerWrap}>
                <Text style={styles.noticeNoTitle}>{item.noticeNo}</Text>
                <Text style={{ paddingHorizontal: 10, color: '#676c76', fontSize: 15 }}>
                  {item.happenPlace}에서 발견
                </Text>
              </View>
              <View style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <TouchableOpacity activeOpacity={1} style={styles.noticeButton} onPress={goAlert}>
                  <SimpleLineIcons name="phone" size={16} />
                  <Text style={styles.noticeButtonTitle}>전화</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.noticeButton}>
                  <AntDesign name="export" size={16} />
                  <Text style={styles.noticeButtonTitle}>공유</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                // height: 150,
                margin: 20,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ width: 40, color: '#676c76', fontSize: 14 }}>품종</Text>
                <Text style={{ fontSize: 14 }} ellipsizeMode="tail" numberOfLines={1}>
                  {item.kindCd.substring(item.kindCd.indexOf('[') + 1, item.kindCd.indexOf(']'))}
                  {` > `}
                  {item.kindCd.substring(item.kindCd.indexOf(']') + 2, item.kindCd.length)}
                </Text>
                <View
                  style={{
                    width: 1,
                    backgroundColor: '#676c76',
                    marginHorizontal: 10,
                    marginVertical: 3,
                  }}
                />
                <Text style={{ width: 40, color: '#676c76', fontSize: 14 }}>성별</Text>
                <Text style={{ fontSize: 14 }}>
                  {item.sexCd === 'M' && '수컷'}
                  {item.sexCd === 'F' && '암컷'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ width: 40, color: '#676c76', fontSize: 14 }}>털색</Text>
                <Text style={{ fontSize: 14 }}>{item.colorCd}</Text>
                <View
                  style={{
                    width: 1,
                    backgroundColor: '#676c76',
                    marginHorizontal: 10,
                    marginVertical: 3,
                  }}
                />
                <Text style={{ width: 40, color: '#676c76', fontSize: 14 }}>체중</Text>
                <Text style={{ fontSize: 14 }}>{item.weight}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ width: 40, color: '#676c76', fontSize: 14 }}>나이</Text>
                <Text style={{ fontSize: 14 }}>{item.age}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 5, display: 'flex' }}>
                <Text style={{ width: 40, color: '#676c76', fontSize: 14 }}>특징</Text>
                <Text style={{ fontSize: 14, flex: 1 }}>{item.specialMark}</Text>
              </View>
            </View>
            <View style={styles.line} />
            <View
              style={{
                paddingVertical: 15,
                marginHorizontal: 20,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>보호소</Text>
            </View>
            <NaverMapView style={{ flex: 1, height: 200 }} center={{ ...loaction, zoom: 16 }}>
              <Marker
                coordinate={loaction}
                // onClick={() => console.warn('onClick! p0')}
                caption={{ text: item.careNm }}
              />
            </NaverMapView>
            <View
              style={{
                margin: 20,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ width: 80, color: '#676c76', fontSize: 14 }}>보호센터</Text>
                <Text style={{ fontSize: 14 }}>{item.careNm}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ width: 80, color: '#676c76', fontSize: 14 }}>보호주소</Text>
                <Text style={{ fontSize: 14, flex: 1 }}>{item.careAddr}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ width: 80, color: '#676c76', fontSize: 14 }}>전화번호</Text>
                <Text style={{ fontSize: 14 }}>{item.careTel}</Text>
              </View>
            </View>
            <View style={styles.line} />
            <View
              style={{
                margin: 20,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ width: 80, color: '#676c76', fontSize: 14 }}>관할지역</Text>
                <Text style={{ fontSize: 14 }}>{item.orgNm}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ width: 80, color: '#676c76', fontSize: 14 }}>접수일자</Text>
                <Text style={{ fontSize: 14 }}>{dateFomat(item.happenDt.toString())}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ width: 80, color: '#676c76', fontSize: 14 }}>공고기간</Text>
                <Text style={{ fontSize: 14 }}>
                  {`${dateFomat(item.noticeSdt.toString())} ~ ${dateFomat(
                    item.noticeEdt.toString(),
                  )}`}
                </Text>
              </View>
            </View>
            <View style={styles.line} />
            <View
              style={{
                paddingVertical: 15,
                marginHorizontal: 20,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {item.careNm}에서 보호하고 있어요
              </Text>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ display: 'flex', paddingVertical: 10, overflow: 'hidden', marginBottom: 20 }}
            >
              <View
                style={{
                  width: 130,
                  height: 130,
                  backgroundColor: '#dfdfdf',
                  borderRadius: 5,
                  marginLeft: 20,
                }}
              />
              <View
                style={{
                  width: 130,
                  height: 130,
                  backgroundColor: '#dfdfdf',
                  borderRadius: 5,
                  marginLeft: 10,
                }}
              />
              <View
                style={{
                  width: 130,
                  height: 130,
                  backgroundColor: '#dfdfdf',
                  borderRadius: 5,
                  marginLeft: 10,
                }}
              />
              <View
                style={{
                  width: 130,
                  height: 130,
                  backgroundColor: '#dfdfdf',
                  borderRadius: 5,
                  marginLeft: 10,
                }}
              />
              <View
                style={{
                  width: 130,
                  height: 130,
                  backgroundColor: '#dfdfdf',
                  borderRadius: 5,
                  marginLeft: 10,
                }}
              />
              <View
                style={{
                  width: 130,
                  height: 130,
                  backgroundColor: '#dfdfdf',
                  borderRadius: 5,
                  marginHorizontal: 10,
                  marginRight: 20,
                }}
              />
            </ScrollView>
            {/* <View style={{ height: 150 }} /> */}
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
      {state.open && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 100,
            backgroundColor: '#000',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: safeArea.top + 10,
          }}
        >
          <ImageViewer
            renderHeader={() => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    position: 'absolute',
                    width: 60,
                    height: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 11,
                    right: -10,
                  }}
                  onPress={() => setState({ ...state, open: false })}
                >
                  <AntDesign name="close" size={30} color="#fff" />
                </TouchableOpacity>
              );
            }}
            imageUrls={[
              {
                url: item.popfile,
                freeHeight: true,
              },
            ]}
            index={state.index}
          />
        </View>
      )}
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
  image: {},
  text: {
    margin: 24,
    fontSize: 16,
  },
  noticeBanner: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: -24,
    marginHorizontal: 24,
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: 20,
  },
  noticeBannerWrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeNoTitle: {
    fontSize: 26,
    marginBottom: 10,
  },
  noticeButton: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  noticeButtonTitle: {
    color: '#000',
    fontSize: 16,
    marginLeft: 5,
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
    shadowColor: '#000',
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
    opacity: 0.6,
  },
  notiTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  line: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#b3b6bb',
    flex: 1,
  },
  banner: scrollA => ({
    height: HEADER_MAX_HEIGHT,
    width: '100%',
    opacity: scrollA.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: scrollA.interpolate({
          inputRange: [-HEADER_MAX_HEIGHT, 0, HEADER_MAX_HEIGHT, HEADER_MAX_HEIGHT + 1],
          outputRange: [
            -HEADER_MAX_HEIGHT / 2,
            0,
            HEADER_MAX_HEIGHT * 0.75,
            HEADER_MAX_HEIGHT * 0.75,
          ],
        }),
      },
    ],
  }),
});
