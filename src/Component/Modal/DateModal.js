import React, { Component } from 'react'
import {Text, View, TouchableOpacity,Animated, StyleSheet, Dimensions } from 'react-native'
import {connect}from 'react-redux';
import { isEmptyValid } from '../../Util/Util';
import DatePicker from 'react-native-date-picker';
import { dateModalChange } from '../../Redux/Actions/Action';
import { dateModalClose } from '../../Redux/Actions/Action';
import { dateModalAction } from '../../Redux/Actions/Action';

class DateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fade : new Animated.Value(0),
            bg : new Animated.Value(0),
        }
        this.dateType = this.props.store.dateModalSetting.dateType;
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.open) {
            Animated.timing(this.state.fade,
                {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver:true
                }
            ).start();
            Animated.timing(this.state.bg,
                {
                    toValue: 0.4,
                    duration: 100,
                    useNativeDriver:true
                }
            ).start();
        }
    }
    modalClose = async () => {
        Animated.timing(this.state.fade,
            {
              toValue: 0,
              duration: 400,
              useNativeDriver:true
            }
        ).start(); 
        Animated.timing(this.state.bg,
            {
                toValue: 0,
                duration: 100,
                delay : 200,
                useNativeDriver:true
            }
        ).start();
        setTimeout(() => {
            this.props.dateModalClose();
        },200)
    }
    onDateChange = (selectedDate) => {
        if (this.dateType === '0') {
            this.props.dateModalChange(this.dateType, selectedDate)
        } else if (this.dateType === '1') {
            this.props.dateModalChange(this.dateType, selectedDate)
        }
    };
    onDateEvent = async () => {
        await this.props.dateModalAction(this.dateType);
        this.modalClose();
    }
    
    dateRender = () => {
        if (this.dateType === '0') {
            return (
                <DatePicker
                    style={{ marginTop: 10, marginBottom: 20 }}
                    date={this.props.store.dateModalSetting.startDate}
                    onDateChange={this.onDateChange}
                    mode="date" />
            )
        } else if (this.dateType === '1') {
            return (
                <DatePicker
                    style={{ marginTop: 10, marginBottom: 20 }}
                    date={this.props.store.dateModalSetting.endDate}
                    onDateChange={this.onDateChange}
                    mode="date" />
            )
        }
    }

    render() {
        return (
            <View style={{position:'absolute',  height:'100%', width:'100%', justifyContent:'center', alignItems:'center' ,zIndex:this.props.open?100:-10}}>
                <Animated.View style={{position:'absolute',backgroundColor:'#000', height:'100%', width:'100%',opacity:this.state.bg}}>
                    <TouchableOpacity style={{height:'100%', width:'100%'}} activeOpacity={0.4} onPress={this.modalClose}/>
                </Animated.View>
                <Animated.View style={[styles.modal, {opacity:this.state.fade,}]}>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>{this.props.store.dateModalSetting.title}</Text>
                    </View>
                    {this.dateRender()}
                    <TouchableOpacity style={{ width: '100%', backgroundColor: '#ECB04D', alignItems: 'center', height: 50, justifyContent: 'center' }} activeOpacity={1} onPress={this.onDateEvent}>
                        <Text style={styles.doneText}>
                            설정
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    modal: {
        width:Dimensions.get('window').width - 80,
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

const mapStateToProps = (state) => {
    return {
        store: state
    };
  }

const mapDispatchToProps = (dispatch) => {
return {
    dateModalClose: () => {
            dispatch(dateModalClose());
        },
    dateModalChange: (dateType, date) => {
            dispatch(dateModalChange(dateType, date))
        },
    dateModalAction: (dateType) => {
        dispatch(dateModalAction(dateType))
        }
    };
}
  
export default connect(mapStateToProps, mapDispatchToProps)(DateModal);