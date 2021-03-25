import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class Home extends Component {
    static navigationOption = {
        tabBarIcon: () => { return <Icon name="home"></Icon> }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>Home Screen </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6fc'
    }
})

