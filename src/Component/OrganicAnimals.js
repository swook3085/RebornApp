import axios from 'axios'
import React, { Component } from 'react'
import { Text, View, StyleSheet, Animated, Button, TouchableOpacity } from 'react-native'
import { SERVICE_KEY, SERVICE_URL } from '../Util/CommDef';
import { isEmptyValid, prevMonthYear, dateToString, dateFomat } from '../Util/Util';
import { Picker } from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Date from './Modal/DatePicker';

export default class OrganicAnimals extends Component {
    constructor(props) {
        super(props);
        var startDate = prevMonthYear(3);
        var endDate = prevMonthYear(0);
        this.state = {
            modal: false,                                                         // 모달창 열고 닫기
            openName: '',                                                       // 모달 이름
            animation: new Animated.Value(40),
            select: false,
            sidoDataBody: [],                                                   // 시도 전체 정보
            sidoData: [],                                                           // 시도 정보
            sido: '6110000',                                                     // 시도 값
            sigunguDataBody: [],                                             // 시군구 전체 정보
            sigunguData: [{ label: `모든지역`, value: 0 }],       // 시군구 정보
            sigungu: '',                                                              // 시군구 값
            upkind: 0,                                                              // 축종코드 - 개 : 417000 - 고양이 : 422400 - 기타 : 429900
            kindDataBody: [],                                                   // 품종 전체 정보
            kindData: [{ label: `전 체`, value: 0 }],                  // 품종 정보
            kind: '',                                                                    // 품종 값
            startDateInit: startDate,                                          // 시작 날짜
            startDate: startDate,                                               // 시작 날짜
            endDateInit: endDate,                                            // 종료 날짜
            endDate: endDate,                                                 // 종료 날짜
        }
    }

    componentDidMount() {
        this.getSidoInfoApi();
    }
    // 품종 정보 가져오기
    getKindInfoApi = async (upkind) => {
        this.setState({
            kindData: [{ label: `전 체`, value: 0 }]
        })
        if (this.state.upkind != 0) {
            await axios.get(`${SERVICE_URL}kind?up_kind_cd=${upkind}&serviceKey=${SERVICE_KEY}`).then((res) => {
                console.log(res.data.response.body);
                var kindData = this.state.kindData;
                if (res.status === 200 && !isEmptyValid(res.data.response.body) && !isEmptyValid(res.data.response.body.items) && !isEmptyValid(res.data.response.body.items.item)) {
                    if (Array.isArray(res.data.response.body.items.item)) {
                        res.data.response.body.items.item.forEach((data) => {
                            var kindObj = { label: data.KNm, value: data.kindCd }

                            kindData.push(kindObj);
                        })
                    } else {
                        kindData.push({ label: res.data.response.body.items.item.KNm, value: res.data.response.body.items.item.kindCd });
                    }
                    this.setState({
                        kindDataBody: res.data.response.body,
                        kindData
                    });
                }
            });
        }
    }

    // 시도 정보 가져오기
    getSidoInfoApi = () => {
        if (isEmptyValid(this.state.sidoData)) {
            this.setState({
                sidoData: [{ label: `전 국`, value: 0 }]
            })
            axios.get(`${SERVICE_URL}sido?serviceKey=${SERVICE_KEY}&&numOfRows=20`).then((res) => {
                var sidoData = this.state.sidoData;
                if (res.status === 200 && !isEmptyValid(res.data.response.body) && !isEmptyValid(res.data.response.body.items) && !isEmptyValid(res.data.response.body.items.item)) {
                    res.data.response.body.items.item.forEach((data) => {
                        var sidoObj = { label: data.orgdownNm, value: data.orgCd }

                        sidoData.push(sidoObj);
                    })

                    this.setState({
                        sidoDataBody: res.data.response.body,
                        sidoData: sidoData
                    });
                }
                console.log(res);
            });
        }
    }
    // 시군구 정보 가져오기
    getSigunguInfoApi = async (orgCd) => {
        this.setState({
            sigunguData: [{ label: `모든지역`, value: 0 }]
        })
        if (this.state.sido != 0) {
            await axios.get(`${SERVICE_URL}sigungu?upr_cd=${orgCd}&serviceKey=${SERVICE_KEY}`).then((res) => {
                console.log(res.data.response.body);
                var sigunguData = this.state.sigunguData;
                if (res.status === 200 && !isEmptyValid(res.data.response.body) && !isEmptyValid(res.data.response.body.items) && !isEmptyValid(res.data.response.body.items.item)) {
                    res.data.response.body.items.item.forEach((data) => {
                        var sigunguObj = { label: data.orgdownNm, value: data.orgCd }

                        sigunguData.push(sigunguObj);
                    })
                    this.setState({
                        sigunguDataBody: res.data.response.body,
                        sigunguData
                    });
                }
            });
        }
    }
    searchOnPress = async () => {
        var sidoorgCd = '', sigunguorgCd = '', kind = '', upkind = '';
        if (this.state.sido != 0) {
            sidoorgCd = this.state.sido;
        };
        if (this.state.sigungu != 0) {
            sigunguorgCd = this.state.sigungu;
        };
        if (this.state.kind != 0) {
            kind = this.state.kind;
        };
        if (this.state.upkind != 0) {
            upkind = this.state.upkind;
        };
        // await this.setState({
        //     progress : true,
        //     page : this.state.page + 1
        // })
        var param = {
            page: 1,
            upkind: upkind,                                    // 축종
            kind: kind,                                        // 품종
            sidoorgCd: sidoorgCd,                              // 시도 데이터 num default 전국 - 0
            sigunguorgCd: sigunguorgCd,                        // 시군구 데이터 num default 모든지역 - 0
            startDate: dateToString(this.state.startDate),     // 시작 날짜
            endDate: dateToString(this.state.endDate)          // 종료 날짜
        };
        console.log(param);
        // await axios.get(`${SERVICE_URL}abandonmentPublic?upkind=${upkind}&kind=${kind}&upr_cd=${sidoorgCd}&org_cd=${sigunguorgCd}&bgnde=${dateToString(this.state.startDate)}&endde=${dateToString(this.state.endDate)}&pageNo=1&numOfRows=20&serviceKey=${SERVICE_KEY}`).then((res) => {
        //     console.log(res.data.response.body);
        // });
    }

    modalEvent = openName => () => {
        this.setState({
            modal: !this.state.modal,
            openName
        })
    }
    onChage = async (value) => {
        await this.setState({
            sido: value
        })
        console.log(this.state.sido)
    }
    inputOnChange = async (state, value) => {
        await this.setState({
            [state]: value
        });

        switch (state) {
            case 'upkind':
                this.getKindInfoApi(this.state.upkind);
            case 'sido':
                this.getSigunguInfoApi(this.state.sido);
            default:
                break;
        }
    }
    onPress = () => {
        if (!this.state.select) {
            Animated.timing(this.state.animation, {
                toValue: 120,
                duration: 800,
                useNativeDriver: false
            }).start();
            this.setState({
                select: true
            })
        } else {
            Animated.timing(this.state.animation, {
                toValue: 40,
                duration: 800,
                useNativeDriver: false
            }).start();
            this.setState({
                select: false
            })
        }
    }
    inputOnChange = state => event => {
        this.setState({
            [state]: event.currentTarget.value
        })
    }
    onDateChange = state => (selectedDate) => {
        this.setState({
            [state]: selectedDate
        })
    };
    onDateEvent = state => () => {
        if (state === 'startDate') {
            this.setState({
                [state]: this.state.startDateInit,
                modal: false
            });
        }
        if (state === 'endDate') {
            this.setState({
                [state]: this.state.endDateInit,
                modal: false
            });
        }
    };


    modalRender = () => {
        if (this.state.openName === 'startDate') {
            return (
                <Date date={this.state.startDate} modal={this.modalEvent('startDate')} onDateChange={this.onDateChange('startDateInit')} onDateEvent={this.onDateEvent('startDate')} />
            )
        }
        if (this.state.openName === 'endDate') {
            return (
                <Date date={this.state.endDate} modal={this.modalEvent('endDate')} onDateChange={this.onDateChange('endDateInit')} onDateEvent={this.onDateEvent('endDate')} />
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Animated.View style={[{ flexDirection: 'row', overflow: "hidden", marginTop: 10, marginLeft: 10, marginRight: 10, borderWidth: 1, borderBottomWidth: 0 }, { height: this.state.animation }]}>
                    <View style={{ height: 120, flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1 }}>
                            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                                <Picker
                                    enabled={true}
                                    selectedValue={this.state.upkind}
                                    style={styles.selectStyle}
                                    onValueChange={(value) => this.inputOnChange('upkind', value)}
                                >
                                    <Picker.Item label={`전 체`} value={0} />
                                    <Picker.Item label={`강아지`} value={`417000`} />
                                    <Picker.Item label={`고양이`} value={`422400`} />
                                    <Picker.Item label={`기 타`} value={`429900`} />
                                </Picker>
                            </View>
                            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                                <Picker
                                    enabled={true}
                                    selectedValue={this.state.kind}
                                    style={styles.selectStyle}
                                    onValueChange={(value) => this.inputOnChange('kind', value)}
                                >
                                    {this.state.kindData.map((data, index) => {
                                        return (
                                            <Picker.Item key={index} label={`${data.label}`} value={`${data.value}`} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'blue', flexDirection: 'row', borderBottomWidth: 1 }}>
                            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                                <Picker
                                    enabled={true}
                                    selectedValue={this.state.sido}
                                    style={styles.selectStyle}
                                    onValueChange={(value) => this.inputOnChange('sido', value)}
                                >
                                    {this.state.sidoData.map((data, index) => {
                                        return (
                                            <Picker.Item key={index} label={`${data.label}`} value={`${data.value}`} />
                                        )
                                    })}
                                </Picker>
                            </View>
                            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                                <Picker
                                    enabled={true}
                                    selectedValue={this.state.sigungu}
                                    style={styles.selectStyle}
                                    onValueChange={(value) => this.inputOnChange('sigungu', value)}
                                >
                                    {this.state.sigunguData.map((data, index) => {
                                        return (
                                            <Picker.Item key={index} label={`${data.label}`} value={`${data.value}`} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center' }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={this.modalEvent('startDate')}>
                                    <Text style={{ fontSize: 16 }}>{dateFomat(dateToString(this.state.startDate))}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text>~</Text>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={this.modalEvent('endDate')}>
                                    <Text style={{ fontSize: 16 }}>{dateFomat(dateToString(this.state.endDate))}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Animated.View style={{ width: 80, height: this.state.animation }}>
                        <TouchableOpacity activeOpacity={0.8} style={{ flex: 1, width: 80, backgroundColor: '#ECB04D', alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1 }} onPress={this.searchOnPress} >
                            <Text style={{ color: '#fff' }}><Icon name='search' /> 검색</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
                <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={this.onPress}>
                    <Text>{this.state.select ? '접기' : '열기'}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, backgroundColor: 'gray' }}>

                </View>
                {this.state.modal && this.modalRender()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6fc'
    },
    selectStyle: {
        flex: 1,
        fontSize: 12,
    },
    card: {
        borderWidth: 1,
        width: 200,
        borderColor: "rgba(155,155,155,1)",
        borderBottomLeftRadius: 10,
        marginTop: 10,
        marginLeft: 4
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10
    }
})
