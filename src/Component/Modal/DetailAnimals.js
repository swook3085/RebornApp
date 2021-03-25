import React, { Component } from 'react'
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native'

export default class DetailAnimals extends Component {
    constructor(props) {
        super(props);
        this.value = new Animated.Value(0);
    }

    render() {
        if (this.props.open) {
            Animated.timing(this.value, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: false
            }).start();
            this.translateY = this.value.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [100, 100, 0]
            })
        }
        return (
            <View style={{ backgroundColor: '#f4f6fc', position: 'absolute', width: Dimensions.get('window').width, height: Dimensions.get('window').height }}>
                <View style={{ height: 300, borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={this.props.modal} style={styles.backButton}>
                        <Text style={{ color: '#000', fontSize: 20 }}>Back</Text>
                    </TouchableOpacity>
                    <Image source={{ uri: this.props.data.filename }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                </View>
                <Animated.View style={{
                    flex: 1, height: 300, transform: [
                        { translateY: this.translateY },
                    ],
                    opacity: this.props.opacity
                }}>
                    <Text> textInComponent </Text>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        zIndex: 10,
        width: 100,
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
    }
})
