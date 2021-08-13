import React, {useState, useEffect} from 'react';
import {View, Text, StatusBar, TouchableOpacity} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const BANNER_H = 300;
const TOPNAVI_H = 60;

const TopNavigation = props => {
  const safeArea = useSafeArea();
  const navigation = useNavigation();
  const {title, scrollA} = props;
  const isFloating = !!scrollA;
  const [isTransparent, setTransparent] = useState(isFloating);

  useEffect(() => {
    if (!scrollA) {
      return;
    }
    const listenerId = scrollA.addListener(a => {
      const topNaviOffset = BANNER_H - TOPNAVI_H - safeArea.top;
      isTransparent !== a.value < topNaviOffset &&
        setTransparent(!isTransparent);
    });
    return () => scrollA.removeListener(listenerId);
  });

  return (
    <>
      <StatusBar
        barStyle={isTransparent ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container(safeArea, isFloating, isTransparent)}>
        <TouchableOpacity activeOpacity={1} onPress={() => navigation.goBack()} style={[styles.backButton(safeArea)]}>
          <MaterialIcons name="arrow-back-ios" color={'#000'} size={25} />
        </TouchableOpacity>
        <Text style={styles.title(isTransparent)}>{title}</Text>
      </View>
    </>
  );
};

const styles = {
  container: (safeArea, isFloating, isTransparent) => ({
    paddingTop: safeArea.top,
    marginBottom: isFloating ? -TOPNAVI_H - safeArea.top : 0,
    height: TOPNAVI_H + safeArea.top,
    justifyContent: 'center',
    shadowOffset: {y: 0},
    backgroundColor: isTransparent ? 'rgba(255,255,255,0)' : '#ECB04D',
    shadowOpacity: isTransparent ? 0 : 0.5,
    elevation: isTransparent ? 0.01 : 5,
    zIndex: 100,
  }),
  title: isTransparent => ({
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: isTransparent ? 'rgba(255,255,255,0)' : '#fff',
  }),
  backButton: (safeArea) => ({
    position: 'absolute',
    zIndex: 10,
    width: 60,
    height: 40,
    left: 0,
    top: safeArea.top + 10,
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
  }),
};

export default TopNavigation;