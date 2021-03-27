import React, { Component } from 'react'
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native'
import { SharedElement } from 'react-native-shared-element';
import { WIDTH } from '../../Util/CommDef';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export const DetailScreen = ({navigation, route}) => (
    <React.Fragment>
        <View style={StyleSheet.absoluteFill}>
            {/* <SharedElement id={`item.${route.params.item.desertionNo}.bg`} style={{ height: 300, borderBottomWidth: 1, backgroundColor: '#f4f6fc' }}>
                <View style={{ height: 300, borderBottomWidth: 1, backgroundColor: '#f4f6fc' }} />
            </SharedElement> */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={{ color: '#000', fontSize: 18 }}>Back</Text>
            </TouchableOpacity>
            <SharedElement id={`item.${route.params.item.desertionNo}.image`} >
                <Image source={{ uri: route.params.item.popfile}} style={[{ height: 300, width:180, resizeMode:'cover',}]} />
            </SharedElement>
            {/* <SharedElement id={`item.${route.params.item.desertionNo}.image`} style={{height:300}}>
                <Image source={{ uri: route.params.item.popfile}} style={{ width:'100%', height: 300, resizeMode: 'cover' }} />
            </SharedElement> */}
            <SharedElement id={`generate.bg`} style={styles.bg} >
                <View style={styles.bg} />
            </SharedElement>
        </View>
    </React.Fragment>
);

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        zIndex: 10,
        width: 80,
        height: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginTop: 20,
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
        height: WINDOW_HEIGHT,
        backgroundColor:'red',
        transform: [{
            translateY: (WINDOW_HEIGHT - 250) / 2
        }]
    }
})

DetailScreen.sharedElements = (route, otherRoute, showing) => {
    const { item } = route.params;

    return [
        {
            id: `item.${item.desertionNo}.image`
        },
        {
            id: `item.${item.desertionNo}.bg`
        },
        {
            id: `generate.bg`
        }
    ]
}