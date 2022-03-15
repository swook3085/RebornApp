import React from 'react';
import { Text, View, Animated, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { dateFomat } from '../../Util/Util';
// import { SharedElement } from 'react-navigation-shared-element';
import dog from '../../resource/images/happydog.png';
import cat from '../../resource/images/happycat.png';
import boy from '../../resource/images/boy.png';
import girl from '../../resource/images/girl.png';
import { useNavigation } from '@react-navigation/native';

export default function AnimalList(props) {
  const { state } = props;
  const navigation = useNavigation();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const ITEM_SIZE = 120 + 10 * 2;

  const Row = ({ children }) => {
    return <View style={{ flexDirection: 'row', height: 22 }}>{children}</View>;
  };

  return (
    <Animated.FlatList
      style={{ flex: 1, backgroundColor: '#f1f1f1' }}
      showsVerticalScrollIndicator={false}
      data={props.data}
      contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 10 }}
      renderItem={({ item, index }) => {
        const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 3)];
        const opacityInputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 1)];
        const scale = scrollY.interpolate({
          inputRange,
          outputRange: [1, 1, 1, 0],
        });
        const opacity = scrollY.interpolate({
          inputRange: opacityInputRange,
          outputRange: [1, 1, 1, 0],
        });

        return (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('Details', {
                item,
                index,
                sido: state.sidoData,
                sigungu: state.sigunguData,
              })
            }
            style={{ height: 125, marginBottom: 15 }}
          >
            <Animated.View
              style={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 15 },
                transform: [{ scale }],
                opacity,
              }}
            >
              {/* <SharedElement id={`item.${index}.image`} style={[{ height: '100%', width: 140, borderBottomLeftRadius: 16, borderTopLeftRadius: 16, position: 'absolute', left: 0 }]} collapsable={false}> */}
              <Image
                source={{ uri: item.popfile }}
                resizeMode="cover"
                style={[
                  {
                    height: '100%',
                    width: 140,
                    borderBottomLeftRadius: 15,
                    borderTopLeftRadius: 15,
                  },
                ]}
              />
              {/* </SharedElement> */}
              {/* <SharedElement id={`item.${index}.statebg`} style={{ borderBottomLeftRadius: 16, position: 'absolute', left: 0, bottom: 0 }}>
                                <View style={{ width: 140, height: 30, backgroundColor: '#000', opacity: 0.5, borderBottomLeftRadius: 16 }} />
                            </SharedElement> */}
              {/* <SharedElement id={`item.${index}.stateTx`} style={{ color: '#fff', position: 'absolute', left: 25, width: 90, bottom: 5, fontSize: 12 }}>
                                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 12 }}>{item.processState}</Text>
                            </SharedElement> */}
              {/* <Text style={{ color: '#fff', position: 'absolute', left: 35, width: 70, bottom: 5, textAlign: 'center', fontSize: 12 }}>{item.processState}</Text> */}
              <View
                style={{
                  flex: 1,
                  height: '100%',
                }}
              >
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ justifyContent: 'center', paddingLeft: 10, paddingTop: 5 }}>
                    {item.kindCd.indexOf('개') > -1 && (
                      <Image source={dog} resizeMode={'cover'} style={{ width: 20, height: 20 }} />
                    )}
                    {item.kindCd.indexOf('고양이') > -1 && (
                      <Image source={cat} resizeMode={'cover'} style={{ width: 20, height: 20 }} />
                    )}
                  </View>
                  <View style={{ justifyContent: 'center', paddingLeft: 5, paddingTop: 5 }}>
                    {item.sexCd === 'M' && (
                      <Image source={boy} resizeMode={'cover'} style={{ width: 20, height: 20 }} />
                    )}
                    {item.sexCd === 'F' && (
                      <Image source={girl} resizeMode={'cover'} style={{ width: 20, height: 20 }} />
                    )}
                  </View>
                </View>
                <View style={{ flex: 3, padding: 10, paddingTop: 0 }}>
                  <Row>
                    <Text style={[styles.title, styles.font]}>품종</Text>
                    <Text style={[{ paddingRight: 50 }]} ellipsizeMode="tail" numberOfLines={1}>
                      {item.kindCd.substring(
                        item.kindCd.indexOf('[') + 1,
                        item.kindCd.indexOf(']'),
                      )}
                      {` > `}
                      {item.kindCd.substring(item.kindCd.indexOf(']') + 2, item.kindCd.length)}
                    </Text>
                  </Row>
                  <Row>
                    <Text style={[styles.title, styles.font]}>등록일</Text>
                    <Text>{dateFomat(item.happenDt.toString())}</Text>
                  </Row>
                  <Row>
                    <Text style={[styles.title, styles.font]}>지역</Text>
                    <Text>{item.orgNm}</Text>
                  </Row>
                  <Row>
                    <Text style={[styles.title, styles.font]}>보호소</Text>
                    <Text>{item.careNm}</Text>
                  </Row>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={props.initData}
      onEndReachedThreshold={2}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      })}
      refreshing={props.state.refreshing}
      onRefresh={props.refresh}
    />
  );
}

const styles = StyleSheet.create({
  font: { color: '#676c76' },
  title: { width: 50 },
});
