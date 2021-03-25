import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'

export default class ListItem extends Component {
    render() {
        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', height: 150, marginBottom: 10, borderRadius: 10, overflow: 'hidden' }} activeOpacity={1} onPress={() => this.props.onPress(this.props.data)}>
                <View style={{ width: 150 }}>
                    <Image source={{ uri: this.props.data.filename }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>
                    <Text>{this.props.data.age}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({

})
