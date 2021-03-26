import React, { Component } from 'react'
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native'
import { SharedElement } from 'react-native-shared-element';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

class DetailAnimals extends Component {
    constructor(props) {
        super(props);
        this.value = new Animated.Value(0);
    }

    render() {
        const { item } = this.props.route.params;

        return (
            // <View style={{ position: 'absolute', width: Dimensions.get('window').width, height: Dimensions.get('window').height }}>
            //     <View style={{ height: 300, borderBottomWidth: 1, backgroundColor: '#f4f6fc', }}>
            //         <TouchableOpacity style={styles.backButton}>
            //             <Text style={{ color: '#000', fontSize: 20 }}>Back</Text>
            //         </TouchableOpacity>
            //         {/* <Image source={{ uri: this.props.data.filename }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} /> */}
            //     </View>
            //     <Animated.View style={{
            //         flex: 1, height: 300, transform: [
            //             { translateY: this.translateY },
            //         ],
            //         opacity: this.opacity,
            //     }}>
            //         <Text> textInComponent </Text>
            //     </Animated.View>
            // </View>
            <View style={StyleSheet.absoluteFill}>
                <View style={{ height: 300, borderBottomWidth: 1, backgroundColor: '#f4f6fc', }} />
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
                    <Text style={{ color: '#000', fontSize: 18 }}>Back</Text>
                </TouchableOpacity>
                <SharedElement id={`item.${item.desertionNo}.image`} style={{ width: '100%', height: 300, resizeMode: 'contain', position: 'absolute', top: 0 }}>
                    <Image source={{ uri: item.filename }} style={{ width: '100%', height: 300, resizeMode: 'contain', position: 'absolute', top: 0 }} />
                </SharedElement>
                <SharedElement id={`generate.bg`} style={styles.bg} >
                    <View style={styles.bg} />
                </SharedElement>
            </View>
        )
    }
}

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
        backgroundColor: 'red',
        transform: [{
            translateY: (WINDOW_HEIGHT - 250) / 2
        }]
    }
})

DetailAnimals.sharedElements = (route, otherRoute, showing) => {
    const { item } = route.params;

    return [
        {
            id: `item.${item.desertionNo}.image`
        },
        {
            id: `generate.bg`
        }
    ]
}
export default DetailAnimals;