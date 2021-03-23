import React, { Component } from 'react'
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import DatePicker from 'react-native-date-picker'

export default class DatePickerModal extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.background} activeOpacity={1} onPress={this.props.modal} />
                <View style={styles.modal}>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>{this.props.title}</Text>
                    </View>
                    <DatePicker
                        style={{ marginTop: 10, marginBottom: 20 }}
                        date={this.props.date}
                        onDateChange={this.props.onDateChange}
                        mode="date" />
                    <TouchableOpacity style={{ width: '100%', backgroundColor: '#ECB04D', alignItems: 'center', height: 50, justifyContent: 'center' }} activeOpacity={1} onPress={this.props.onDateEvent}>
                        <Text style={styles.doneText}>
                            완료
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent :'center'
    },
    background: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        overflow: 'hidden'
    },
    modal: {
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    title: {
        width: '100%',
        margin: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#c8ced3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    doneText: {
        color: '#fff',
        fontSize: 16,
    },
    titleText: {
        fontSize: 18,
        marginBottom: 10
    }
});