import axios from 'axios'
import React, { Component } from 'react'
import { Text, View, StyleSheet, Animated, Button, TouchableOpacity, ScrollView, FlatList, Dimensions, SafeAreaView, Image } from 'react-native'
import { SERVICE_KEY, SERVICE_URL } from '../Util/CommDef';
import { isEmptyValid, prevMonthYear, dateToString, dateFomat } from '../Util/Util';
import { Picker } from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Date from './Modal/DatePicker';
import Modal from 'react-native-modal';
import ListItem from './Animals/ListItem';
import DetailAnimals from './Modal/DetailAnimals';
import { SharedElement } from 'react-native-shared-element';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default class OrganicAnimals extends Component {
    constructor(props) {
        super(props);
        var startDate = prevMonthYear(3);
        var endDate = prevMonthYear(0);
        this.state = {
            indexChk: null,                                                        // 리스트 클릭
            value: new Animated.Value(0),
            detaileModal: false,                                             // 상세정보 모달창 열고닫기
            modal: false,                                                         // 모달창 열고 닫기
            openName: '',                                                       // 모달 이름
            exAnimation: new Animated.Value(40),
            expansion: false,                                                   // 확장 버튼 열고 접기
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
            animalData: [],                                                       // 검색 정보                 
            detailData: {}                                                         // 상세정보
        }
    }

    async componentDidMount() {
        await this.getSidoInfoApi();
        await this.searchOnPress();
        this.opacity = this.state.value.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
        });
        this.x = this.state.value.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 20, 200],
        });
        this.height = this.state.value.interpolate({
            inputRange: [0, 1],
            outputRange: [150, 250],
        });
        this.top = this.state.value.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0],
        });
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
            axios.get(`${SERVICE_URL}sido?serviceKey=${SERVICE_KEY}&&numOfRows=20`).then((res) => {
                var sidoData = [];
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
    // 검색 정보 가져오기
    searchOnPress = async () => {
        var sigunguorgCd = '', kind = '', upkind = '';

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
            sidoorgCd: this.state.sido,                              // 시도 데이터 num default 전국 - 0
            sigunguorgCd: sigunguorgCd,                        // 시군구 데이터 num default 모든지역 - 0
            startDate: dateToString(this.state.startDate),     // 시작 날짜
            endDate: dateToString(this.state.endDate)          // 종료 날짜
        };
        console.log(param);
        await axios.get(`${SERVICE_URL}abandonmentPublic?upkind=${upkind}&kind=${kind}&upr_cd=${this.state.sido}&org_cd=${sigunguorgCd}&bgnde=${dateToString(this.state.startDate)}&endde=${dateToString(this.state.endDate)}&pageNo=1&numOfRows=20&serviceKey=${SERVICE_KEY}`).then((res) => {
            console.log(res.data.response.body);
            if (res.status === 200 && !isEmptyValid(res.data.response.body) && !isEmptyValid(res.data.response.body.items) && !isEmptyValid(res.data.response.body.items.item)) {
                this.setState({
                    animalData: res.data.response.body.items.item,
                });
            }
        });
    }
    // 모달 이벤트
    modalEvent = openName => () => {
        if (openName === 'detail') {
            Animated.timing(this.state.value, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: false
            }).start();
            this.opacity = this.state.value.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
            });
            this.setState({
                detaileModal: !this.state.detaileModal,
                openName
            })
            return;
        }
        this.setState({
            modal: !this.state.modal,
            openName
        })
    }
    // 데이터 변경 확인
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
    // 확장 이벤트 
    onExpansionPress = () => {
        if (!this.state.expansion) {
            Animated.timing(this.state.exAnimation, {
                toValue: 120,
                duration: 500,
                useNativeDriver: false
            }).start();
            this.setState({
                expansion: true
            })
        } else {
            Animated.timing(this.state.exAnimation, {
                toValue: 40,
                duration: 500,
                useNativeDriver: false
            }).start();
            this.setState({
                expansion: false
            })
        }
    }
    // 시작일 종료일 변경 확인
    onDateChange = state => (selectedDate) => {
        this.setState({
            [state]: selectedDate
        })
    };
    // 시작일 종려일 변경
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
    // 유기동물 상세 정보
    animalDefInfoOnPress = (data, index) => {
        Animated.timing(this.state.value, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
        }).start();

        console.log(index)
        this.setState({
            indexChk: index
            // detailData: data,
            // detaileModal: true,
            // openName: 'detail',
        });
    }

    // 모달 화면
    modalRender = () => {
        if (this.state.openName === 'startDate') {
            return (
                <Date date={this.state.startDate} title={'시작일 설정'} modal={this.modalEvent('startDate')} onDateChange={this.onDateChange('startDateInit')} onDateEvent={this.onDateEvent('startDate')} />
            )
        }
        if (this.state.openName === 'endDate') {
            return (
                <Date date={this.state.endDate} title={'종료일 설정'} modal={this.modalEvent('endDate')} onDateChange={this.onDateChange('endDateInit')} onDateEvent={this.onDateEvent('endDate')} />
            )
        }
        if (this.state.openName === 'detail') {
            return (
                <DetailAnimals data={this.state.detailData} modal={this.modalEvent('detail')} open={this.state.detaileModal} opacity={this.state.opacity} />
            )
        }
    }
    // 유기동물 리스트
    _animalRender = ({ item, index }) => {
        if (!isEmptyValid(item)) {
            return (
                <ListItem index={index} data={item} onPress={this.animalDefInfoOnPress} height={this.height} top={this.top} indexChk={this.state.indexChk} />
            )
        }
    }

    render() {
        console.log(this.props)
        return (
            <>
                <SafeAreaView style={{ flex: 1 }}>
                    <Animated.View style={[styles.container]}>
                        <Animated.View style={[{ flexDirection: 'row', overflow: "hidden", borderWidth: 1, borderBottomWidth: 0, marginLeft: 10, marginRight: 10, marginTop: 10 }, { height: this.state.exAnimation }]}>
                            <View style={{ height: 120, flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1 }}>
                                    <View style={{ flex: 1, backgroundColor: '#fff' }}>
                                        <Picker
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
                                <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1 }}>
                                    <View style={{ flex: 1, backgroundColor: '#fff' }}>
                                        <Picker
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
                            <Animated.View style={{ width: 80, height: this.state.exAnimation }}>
                                <TouchableOpacity activeOpacity={1} style={{ flex: 1, width: 80, backgroundColor: '#ECB04D', alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1 }} onPress={this.searchOnPress} >
                                    <Text style={{ color: '#fff' }}><Icon name='search' /> 검색</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </Animated.View>
                        <TouchableOpacity activeOpacity={1} style={[styles.button, { marginBottom: 10, marginLeft: 10, marginRight: 10 }]} onPress={this.onExpansionPress}>
                            <Text>{this.state.expansion ? '접기' : '열기'}</Text>
                        </TouchableOpacity>
                        <FlatList style={{ flex: 1, backgroundColor: '#f4f6fc' }} data={this.state.animalData} contentContainerStyle={{ padding: 10 }}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('Details', { item })}>
                                        <View style={{ flex: 1, flexDirection: 'row', height: 150, marginBottom: 10, borderRadius: 10, overflow: 'hidden' }}>
                                            <SharedElement id={item.desertionNo} style={[{ width: 150, height: 150, position: 'absolute', top: 0, left: 0, zIndex: 10 }]}>
                                                <Image source={{ uri: item.filename }} style={[{ width: 150, height: 150, position: 'absolute', top: 0, left: 0, zIndex: 10 }]} />
                                            </SharedElement>
                                            {/* <View style={[{ width: 150, height: 150, position: 'absolute', top: 0, left: 0, zIndex: 10 }]}>
                                                    <SharedElement id={`item.${item.desertionNo}.image`} style={[{ width: '100%', height: '100%', resizeMode: 'cover' }]}>
                                                        <Image source={{ uri: item.filename }} style={[{ width: '100%', height: '100%', resizeMode: 'cover' }]} />
                                                    </SharedElement>
                                                </View> */}
                                            <View style={{ backgroundColor: '#fff', position: 'absolute', left: 150, width: '100%', height: '100%' }}>
                                                <Text>{item.age}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity >
                                )
                            }}
                            keyExtractor={(item, index) => { return index }} />
                        <SharedElement id={`generate.bg`}>
                            <View style={styles.bg} />
                        </SharedElement>
                        <Modal isVisible={this.state.modal}>
                            {this.state.modal && this.modalRender()}
                        </Modal>
                    </Animated.View>
                </SafeAreaView>
                {this.state.detaileModal && this.modalRender()}
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6fc',
        // paddingTop: 10,
        // paddingLeft: 10,
        // paddingRight: 10,
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
