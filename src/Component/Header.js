import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons';

export default class Header extends Component {
    render() {
        return (
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Reborn</Text>
                <Icon style={styles.userIcon} name="user" color={'#fff'} size={20}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header : {
        height : 50,
        backgroundColor : '#ECB04D',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle : {
        color : "#fff",
        marginLeft : 20,
        fontSize : 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userIcon : {
        marginRight : 20,
    }
})
