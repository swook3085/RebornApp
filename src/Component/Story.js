import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default class Story extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Story Screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    }
})