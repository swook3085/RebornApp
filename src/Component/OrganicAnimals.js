import axios from 'axios'
import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { SERVICE_KEY, SERVICE_URL } from '../Util/CommDef';
import { isEmptyValid } from '../Util/Util';
import { Picker } from '@react-native-community/picker'

export default class OrganicAnimals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidoDataBody : [],          // 시도 전체 정보
            sidoData : [],              // 시도 정보
            sido : '6110000',           // 시도 값
            upkind : 0,                 // 축종코드 - 개 : 417000 - 고양이 : 422400 - 기타 : 429900
        }
    }

    componentDidMount() {
        this.getSidoInfoApi();
    }
    // 품종 정보 가져오기
    getKindInfoApi = (upkind) => {
        var param = {
            upkind : upkind
        };
        console.log(param)
        axios.post(`${getUrl()}/dog/kind`, param).then((res) => {
            if (!isEmptyValid(res.data)) {
                console.log(Array.isArray(res.data.items.item))
                if (Array.isArray(res.data.items.item)) {
                    this.setState({
                        kindData : res.data.items.item
                    })
                } else {
                    var array = [];
                    array.push(res.data.items.item);
                    this.setState({
                        kindData : array
                    })
                }
            }
        });
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
                        sidoDataBody : res.data.response.body,
                        sidoData : sidoData
                    });
                }
                console.log(res);
            });
        }
    }
    onChage = async (value) => {
        await this.setState({
            sido : value 
        })
        console.log(this.state.sido)
    }
    inputOnChange = async (state, value) => {
        await this.setState({
            [state] : value
        });

        switch (state) {
            case 'upkind':
                if (this.state.upkind != 0) {
                    console.log(this.state.upkind)
                    // this.getKind(this.state.upkind);
                }
                break;
            default:
                break;
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{height:100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{height:100, backgroundColor:'gray', flex: 1}}>
                        <View style={{flex:1, flexDirection: 'row'}}>
                            <View style={{flex:1, backgroundColor:'#fff'}}>
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
                            <View style={{flex:1, backgroundColor:'gray'}}>
                            
                            </View>
                        </View>
                        <View style={{flex:1, backgroundColor:'blue'}}>
                            
                        </View>
                        <View style={{flex:1, backgroundColor:'yellow'}}>
                        
                        </View>
                    </View>
                    <View style={{width: 80, height: 100, backgroundColor: '#706fd3', borderWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center'}}>
                        
                    </View>
                </View>
                {/* <View style={styles.card}>
                    <View style={styles.card}>
                        {this.state.sidoData.length > 0 &&    
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
                        }
                    </View>
                    {this.state.sidoData.length > 0 &&    
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
                    }
                </View> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#fff'
    },
    selectStyle : {
        flex : 1,
        fontSize : 12
    },
    card:{
        borderWidth: 1,
        width: 200,
        borderColor: "rgba(155,155,155,1)",
        borderBottomLeftRadius: 10,
        marginTop: 10,
        marginLeft: 4
      },
})
