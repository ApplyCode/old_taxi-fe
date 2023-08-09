import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, Platform, ScrollView,TextInput } from 'react-native';
import { showToast } from '../constants/Global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import MainHeader from '../components/MainHeader';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import { update_payment } from '../constants/Api';
import { Linking } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'
import { Icon } from 'react-native-elements';
export default class DriverPay extends React.Component {
    constructor(props){
        super(props);
        this.mapRef = null
        this.state = {
            loaded: true,
            driver_name: '',
            driver_email: '',
            card_no: '',
            card_expire_date: '',
            card_cvc: ''
        };
        
    }

    async componentDidMount(){
        let info = await AsyncStorage.getItem("user_info")
        if(info) {
            info = JSON.parse(info)
            if(info['payment'])
                this.setState({pay: parseInt(info['payment'])})
            else
                this.setState({pay: -1})
        }
    }

    async update() {
        this.setState({loaded: false})
        let info = await AsyncStorage.getItem("user_info")
        if(info) {
            info = JSON.parse(info)
        }
        await update_payment(info['id'], 1)
        .then(async (response) => {
            this.setState({loaded: true});
            info['payment'] = 1;
            await AsyncStorage.setItem("user_info", JSON.stringify(info))
            Actions.reset("root")
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    openPaypal() {
        Linking.openURL("https://paypal.com/login")
    }

    render(){
        return (
            <View style={styles.container}>
                <MainHeader />
                <ScrollView style={{flex: 1}}>
                    <View style={{alignItems: 'center'}}>
                        <Image source={require("../assets/images/stripe.png")} resizeMode="contain" style={{height: 100}} />
                    </View>
                    <View style={{paddingTop: 30, padding: 20}}>
                        <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic'}}>50 Euro</Text>
                        <Text style={{textAlign: 'center', fontSize: 20, paddingTop: 20}}>Your Monthly Payment</Text>
                        <View style={{backgroundColor: 'grey', height: 2, marginVertical: 20}}></View>
                        <Text style={{fontSize: 14}}>Card Information</Text>    
                        <TextInputMask
                            type={'credit-card'}
                            options={{
                                obfuscated: false,
                            }}
                            value={this.state.card_no}
                            onChangeText={text => {
                                this.setState({card_no: text})
                            }}
                            style={[styles.formInput]} 
                            maxLength={19}
                        />
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
                            <View style={{flex: 1}}>
                                <Text>MM / YYYY</Text>
                                <TextInputMask
                                    type={'datetime'}
                                    options={{
                                        format: 'MM/YYYY'
                                    }}
                                    maxLength={7}
                                    value={this.state.card_expire_date}
                                    onChangeText={text => {
                                        this.setState({card_expire_date: text})
                                    }}
                                    style = {[styles.formInput]}
                                    
                                />
                            </View>
                            <View style={{flex: 1, }}>
                                <Text>CVC</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={this.state.card_cvc}
                                    onChangeText={text => this.setState({card_cvc: text})} />
                            </View>
                        </View>
                        <Text style={{fontSize: 14, paddingTop: 20}}>Name on card</Text>
                        <TextInput 
                            style={styles.formInput}
                            value={this.state.driver_name}
                            onChangeText={text => this.setState({driver_name: text})} />
                        <Text style={{fontSize: 14, paddingTop: 20}}>Email</Text>
                        <TextInput 
                            style={styles.formInput}
                            value={this.state.driver_email}
                            onChangeText={text => this.setState({driver_email: text})} />

                        <TouchableOpacity style={{backgroundColor: '#7CB034', borderRadius: 5, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10}} onPress={() => this.calc()}>
                            <Icon type="entypo" name="lock" size={20} color="white" />
                            <Text style={{color: 'white', textAlign: 'center', paddingLeft: 10}}>Pay</Text>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
    
}

DriverPay.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    formInput: {
        width: '100%',
        height: 50,
        borderRadius: 5,
        borderColor: '#ABAAAC',
        borderWidth: 1,
        paddingHorizontal: 12,
        color: 'black'
    },
});