import axios from 'axios'
import React, { Component, createRef } from 'react'
import { Text, View, StyleSheet, Animated, Button, TouchableOpacity, ScrollView, FlatList, Dimensions, SafeAreaView, Image, StatusBar } from 'react-native'
import { SERVICE_KEY, SERVICE_URL, WIDTH } from '../../Util/CommDef';
import { isEmptyValid, prevMonthYear, dateToString, dateFomat } from '../../Util/Util';
import { Picker } from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SharedElement } from 'react-navigation-shared-element';
import AnimalList from './AnimalList';
import { dateModalOpen } from '../../Redux/Actions/Action';
import { connect } from 'react-redux';
import dog from '../../resource/images/happydog.png';
import cat from '../../resource/images/happycat.png';
import RBSheet from "react-native-raw-bottom-sheet";
import DatePicker from 'react-native-date-picker';
import * as Animatable from 'react-native-animatable'
import { convertUpkind, convertSido } from '../../Util/Convert';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;


class OrganicAnimals extends Component {
    constructor(props) {
        super(props)
        this.scrollY = new Animated.Value(0);
        var startDate = prevMonthYear(3);
        var endDate = prevMonthYear(0);

        this.state = {
            refreshing: false,
            page: 1,                                                                    // 페이지                                                                                           
            openName: '',                                                           // 모달 이름
            expansionAnimate: new Animated.Value(40),
            expansion: false,                                                        // 확장 버튼 열고 접기
            offsetChk: false,                                                         // 검색창확인
            sidoDataBody: [],                                                       // 시도 전체 정보
            sidoData: [],                                                               // 시도 정보
            sido: '6110000',                                                         // 시도 값
            sigunguDataBody: [],                                                  // 시군구 전체 정보
            sigunguData: [{ label: `모든지역`, value: 0 }],            // 시군구 정보
            sigungu: '',                                                                  // 시군구 값
            upkind: '0',                                                                  // 축종코드 - 개 : 417000 - 고양이 : 422400 - 기타 : 429900
            kindDataBody: [],                                                       // 품종 전체 정보
            kindData: [{ label: `전 체`, value: 0 }],                       // 품종 정보
            kind: '',                                                                       // 품종 값
            startDateInit: startDate,                                             // 시작 날짜
            startDate: startDate,                                                   // 시작 날짜
            endDateInit: endDate,                                                // 종료 날짜
            endDate: endDate,                                                     // 종료 날짜
            animalData: [],                                                            // 검색 정보                 
            detailData: {}                                                              // 상세정보
        }
    }

    async componentDidMount() {
        await this.getSidoInfoApi();
        await this.getSigunguInfoApi(this.state.sido);
        await this._getAnimalData();
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
    // 검새 조건 추출
    animalValid = () => {
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
        var param = {
            page: this.state.page,
            upkind,                                                         // 축종
            kind,                                                           // 품종
            sidoorgCd: this.state.sido,                                     // 시도 데이터 num default 전국 - 0
            sigunguorgCd: sigunguorgCd,                                     // 시군구 데이터 num default 모든지역 - 0
            startDate: dateToString(this.state.startDate),                  // 시작 날짜
            endDate: dateToString(this.state.endDate)                       // 종료 날짜
        };

        return param;
    }

    // 검색 터치 이벤트 
    searchOnPress = async () => {
        // await this.setState({
        //     animalData: [],
        //     page: 1
        // })
        this.RBSheet.open();
        // this._getAnimalData();
    }
    searchOnPressTest = async () => {
        await this.setState({
            animalData: [],
            page: 1
        })
        this._getAnimalData();
    }
    // 유기동물 조회
    _getAnimalData = async () => {
        var data = await this.animalValid();
        console.log(data)
        await axios.get(`${SERVICE_URL}abandonmentPublic?upkind=${data.upkind}&kind=${data.kind}&upr_cd=${data.sidoorgCd}&org_cd=${data.sigunguorgCd}&bgnde=${data.startDate}&endde=${data.endDate}&state=notice&pageNo=${data.page}&numOfRows=20&serviceKey=${SERVICE_KEY}`).then((res) => {
            console.log(res.data.response.body);
            if (res.status === 200 && !isEmptyValid(res.data.response.body) && !isEmptyValid(res.data.response.body.items) && !isEmptyValid(res.data.response.body.items.item)) {
                this.setState({
                    animalData: this.state.animalData.concat(res.data.response.body.items.item),
                    page: this.state.page + 1,
                    refreshing: false
                });
                res.data.response.body.items.item.map((item) => {
                    Image.getSize(item.popfile, (width, height) => {
                        item.width = width;
                        item.height = height;
                        // console.log(`width : ${width}  -------------- height : ${height}`)
                    });
                })
            }
        });
        this.RBSheet.close();
    }

    // 무한 스크롤 이벤트
    _handleLoadMore = () => {
        this._getAnimalData();
    }
    // 모달 이벤트
    modalEvent = openName => () => {
        if (openName === 'startDate') {
            this.props.dateModalOpen(true, '0', '시작일 설정');
        } else if (openName === 'endDate') {
            this.props.dateModalOpen(true, '1', '종료일 설정');
        }
    }
    // 데이터 변경 확인
    inputOnChange = (state, value) => {
        this.setState({
            [state]: value
        });

        // if (state === 'upkind') {
        //     this.getKindInfoApi(this.state.upkind);
        // }
        // if (state === 'sido') {
        //     this.getSigunguInfoApi(this.state.sido);
        // }
    }
    // 확장 이벤트 
    onExpansionPress = () => {
        if (!this.state.expansion) {
            Animated.timing(this.state.expansionAnimate, {
                toValue: 120,
                duration: 500,
                useNativeDriver: false
            }).start();
            this.setState({
                expansion: true
            })
        } else {
            if (this.state.offsetChk) {
                Animated.timing(this.state.expansionAnimate, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false
                }).start();
                this.setState({
                    expansion: false
                })
            } else {
                Animated.timing(this.state.expansionAnimate, {
                    toValue: 40,
                    duration: 500,
                    useNativeDriver: false
                }).start();
                this.setState({
                    expansion: false
                })
            }
        }
    }
    // 시작일 종료일 변경 확인
    onDateChange = state => (selectedDate) => {
        this.setState({
            [state]: selectedDate
        })
    };
    // 시작일 종료일 변경
    onDateEvent = state => () => {
        if (state === 'startDate') {
            this.setState({
                [state]: this.state.startDateInit,
            });
            this.RBSheetStartDate.close();
        }
        if (state === 'endDate') {
            this.setState({
                [state]: this.state.endDateInit,
            });
            this.RBSheetEndDate.close();
        }
    };
    _handleRefresh = () => {
        this.setState({
            animalData: [],
            refreshing: true,
            page: 1,
        }, this._getAnimalData);
    }
    scrollEvent = (e) => {
        // if (e.nativeEvent.contentOffset.y > 20) {
        //     Animated.timing(this.state.expansionAnimate, {
        //         toValue: 0,
        //         duration: 100,
        //         useNativeDriver: false
        //     }).start();
        // } else {
        //     Animated.timing(this.state.expansionAnimate, {
        //         toValue: 40,
        //         duration: 100,
        //         useNativeDriver: false
        //     }).start();
        // }
    }
    renderContent = () => {
        return (
            <>
                <View style={styles.panel}>
                    <View style={{ height: 200, paddingHorizontal: 20 }}>
                        <Animatable.Text style={{ textAlign: 'center', paddingVertical: 10, fontSize: 16 }} animation='zoomIn' delay={200}>품종</Animatable.Text>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Animatable.View style={{ flex: 1, height: 150, padding: 10 }} animation='fadeIn' delay={1 * 200}>
                                <TouchableOpacity activeOpacity={1} style={[styles.card, this.state.upkind == 0 && styles.active]} onPress={() => this.inputOnChange('upkind', '0')}>
                                    <View style={{ height: 60, width: 60, }}>
                                        <Image source={dog} resizeMode={'contain'} style={{ width: 60, height: 60 }} />
                                    </View>
                                    <Text>모든 동물</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                            <Animatable.View style={{ flex: 1, height: 150, padding: 10 }} animation='fadeIn' delay={2 * 200}>
                                <TouchableOpacity activeOpacity={1} style={[styles.card, this.state.upkind == 417000 && styles.active]} onPress={() => this.inputOnChange('upkind', '417000')}>
                                    <View style={{ height: 60, width: 60, }}>
                                        <Image source={dog} resizeMode={'contain'} style={{ width: 60, height: 60 }} />
                                    </View>
                                    <Text>강아지</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                            <Animatable.View style={{ flex: 1, height: 150, padding: 10 }} animation='fadeIn' delay={3 * 200}>
                                <TouchableOpacity activeOpacity={1} style={[styles.card, this.state.upkind == 422400 && styles.active]} onPress={() => this.inputOnChange('upkind', '422400')}>
                                    <View style={{ height: 60, width: 60, }}>
                                        <Image source={cat} resizeMode={'contain'} style={{ width: 60, height: 60 }} />
                                    </View>
                                    <Text>고양이</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>
                    </View>
                    <View style={{ height: 120, paddingHorizontal: 20 }}>
                        <Animatable.Text style={{ textAlign: 'center', paddingVertical: 10, fontSize: 16 }} animation='zoomIn' delay={200}>지역</Animatable.Text>
                        <View style={{ height: 70, marginTop: 10, }}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {this.state.sidoData.map((data, index) => {
                                    return (
                                        <TouchableOpacity key={index} activeOpacity={1} style={{ marginRight: 10, height: 50 }} onPress={() => this.inputOnChange('sido', data.value)}>
                                            <Animatable.View style={[styles.card, this.state.sido == data.value && styles.sidoActive, { padding: 10 }]} animation='fadeInRight' delay={index * 100}>
                                                <Text style={this.state.sido == data.value && styles.sidoTextActive}>{data.label}</Text>
                                            </Animatable.View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>
                        {/* <View style={{ height: 70 }}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {this.state.sigunguData.map((data, index) => {
                                    return (
                                        <TouchableOpacity key={index} activeOpacity={1} style={{ marginRight: 10, height: 50 }} onPress={() => this.inputOnChange('sigungu', data.value)}>
                                            <Animatable.View style={[styles.card, this.state.sigungu == data.value && styles.sidoActive, { padding: 10 }]} animation='fadeInRight' delay={index * 100}>
                                                <Text style={this.state.sigungu == data.value && styles.sidoTextActive}>{data.label}</Text>
                                            </Animatable.View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View> */}
                    </View>
                    <View style={{ height: 100, paddingHorizontal: 20, marginBottom: 20 }}>
                        <Animatable.Text style={{ textAlign: 'center', paddingVertical: 10, fontSize: 16 }} animation='zoomIn' delay={200}>기간</Animatable.Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                            <Animatable.View style={{ flex: 1 }} animation='fadeInUp' delay={200}>
                                <TouchableOpacity style={[styles.card, { width: '90%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }]} activeOpacity={1} onPress={() => this.RBSheetStartDate.open()}>
                                    <Text style={{ fontSize: 16 }}>{dateFomat(dateToString(this.state.startDate))}</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                            <Text>~</Text>
                            <Animatable.View style={{ flex: 1, alignItems: 'flex-end' }} animation='fadeInUp' delay={200}>
                                <TouchableOpacity style={[styles.card, { width: '90%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }]} activeOpacity={1} onPress={() => this.RBSheetEndDate.open()}>
                                    <Text style={{ fontSize: 16 }}>{dateFomat(dateToString(this.state.endDate))}</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: '#ECB04D', alignItems: 'center', flex: 1, justifyContent: 'center', paddingBottom: StatusBar.currentHeight }} activeOpacity={1} onPress={this.searchOnPressTest}>
                        <Text style={{ color: '#fff', fontSize: 18 }}><Icon name='search' size={16} /> 검색</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={{ backgroundColor: '#ECB04D', alignItems: 'center', flex:1}} activeOpacity={1}>
                </TouchableOpacity> */}
                </View>
                <RBSheet ref={ref => { this.RBSheetStartDate = ref }} height={330} duration={250}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                        }
                    }}
                >
                    <View style={styles.title}>
                        <Text style={styles.titleText}>시작일 설정</Text>
                    </View>
                    <DatePicker
                        style={{ height: 180, marginVertical: 20 }}
                        date={this.state.startDateInit}
                        onDateChange={this.onDateChange('startDateInit')}
                        mode="date" />
                    <TouchableOpacity style={{ width: '100%', backgroundColor: '#ECB04D', alignItems: 'center', flex: 1, justifyContent: 'center' }} activeOpacity={1} onPress={this.onDateEvent('startDate')}>
                        <Text style={styles.doneText}>
                            설정
                        </Text>
                    </TouchableOpacity>
                </RBSheet>
                <RBSheet ref={ref => { this.RBSheetEndDate = ref }} height={330} duration={250}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                        }
                    }}
                >
                    <View style={styles.title}>
                        <Text style={styles.titleText}>종료일 설정</Text>
                    </View>
                    <DatePicker
                        style={{ height: 180, marginVertical: 20 }}
                        date={this.state.endDateInit}
                        onDateChange={this.onDateChange('endDateInit')}
                        mode="date" />
                    <TouchableOpacity style={{ width: '100%', backgroundColor: '#ECB04D', alignItems: 'center', flex: 1, justifyContent: 'center' }} activeOpacity={1} onPress={this.onDateEvent('endDate')}>
                        <Text style={styles.doneText}>
                            설정
                        </Text>
                    </TouchableOpacity>
                </RBSheet>
            </>
        );
    }

    render() {
        return (
            <>
                <Animated.View style={[styles.container]}>
                <View style={{ height: StatusBar.currentHeight+20 }} />
                    <Animated.View style={[{ flexDirection: 'row', overflow: "hidden",marginLeft: 10, marginRight: 10, marginTop: 10, borderRadius:5 }, { height: this.state.expansionAnimate }]}>
                        <View style={{ height: 40, flex: 1 }}>
                            <View style={{ display:'flex',flex: 1, flexDirection: 'row', backgroundColor: '#fff',paddingLeft:10}}>
                                <View style={{ justifyContent: 'center', alignItems:'center', display:'flex', flexDirection:'row' }}>
                                    <Text style={{backgroundColor: '#ECB04D', padding:5, paddingHorizontal:10, borderRadius:5, color:'#fff', height:30}}>{convertUpkind(this.state.upkind)}</Text>
                                    <Text style={{backgroundColor: '#ECB04D', padding:5, paddingHorizontal:10, borderRadius:5, color:'#fff', height:30, marginLeft:10}}>{convertSido(this.state.sido.toString())}</Text>
                                </View>
                            </View>
                        </View>
                        <Animated.View style={{ width: 80, height: this.state.expansionAnimate }}>
                            <TouchableOpacity activeOpacity={1} style={{ flex: 1, width: 80, height:40, backgroundColor: '#ECB04D', alignItems: 'center', justifyContent: 'center', }} onPress={this.searchOnPress} >
                                <Text style={{ color: '#fff' }}><Icon name='search' /> 검색</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                    <AnimalList data={this.state.animalData} initData={this._handleLoadMore} refresh={this._handleRefresh} state={this.state} />
                </Animated.View>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    // animationType="fade"
                    height={530}
                    duration={250}
                    dragFromTopOnly={true}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                            backgroundColor: '#f4f6fc'
                        }
                    }}
                    closeOnDragDown={true}
                >

                    {this.renderContent()}
                </RBSheet>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6fc',
    },
    header: {
        backgroundColor: '#fff',
        shadowColor: '#000000',
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#000000',
        marginBottom: 10,
    },
    panel: {
        height: 530,
        backgroundColor: '#f4f6fc',
        paddingTop: 0,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
        shadowOpacity: 0.4,
    },
    selectStyle: {
        flex: 1,
        fontSize: 12,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    bg: {
        position: 'absolute',
        width: '100%',
        height: 0,
        backgroundColor: '#f4f6fc',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    card: {
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: .3,
        shadowRadius: 20,
        elevation: 5,
    },
    active: {
        borderColor: '#ECB04D',
        backgroundColor: '#fff',
    },
    sidoActive: {
        borderColor: '#ECB04D',
        backgroundColor: '#ECB04D',
    },
    sidoTextActive: {
        color: '#fff'
    },
    title: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#c8ced3',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    doneText: {
        color: '#fff',
        fontSize: 16,
    },
    titleText: {
        fontSize: 18,
    }
})

const mapStateToProps = (state) => {
    return {
        store: state
    };
}
const mapDispatchToProps = (dispatch) => {
    // return bindActionCreators(actions, dispatch);
    return {
        dateModalOpen: (dateOpen, dateType, title) => {
            return dispatch(dateModalOpen(dateOpen, dateType, title))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganicAnimals);