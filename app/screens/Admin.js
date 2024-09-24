import React from 'react';
import { StyleSheet, Text, Switch, View, Image, Alert, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { showToast } from '../constants/Global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import Header from '../components/Header';
import { get_driver_list_admin, remove_driver, setOnOff } from '../constants/Api';
import Layout from '../constants/Layout';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
export default class Admin extends React.Component {
    constructor(props){
        super(props);
        this.mapRef = null
        this.state = {
            loaded: true,
            email: '',
            title: '',
            description: '',
            list: null
        };
        
    }


    UNSAFE_componentWillReceiveProps() {
        this.refresh();
    }
    async refresh() {
        let info = await AsyncStorage.getItem("user_info")
        if(info) {
            info = JSON.parse(info)
        }
        this.setState({loaded: false})
        await get_driver_list_admin()
        .then(async (response) => {
            this.setState({loaded: true})
            if(response.data) {
                this.setState({list: response.data})
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    async removeDriver(driver_id) {
        Alert.alert(
            "Remove",
            "Do you want to remove driver?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "OK", onPress: () => this.remove(driver_id) }
            ],
            { cancelable: false }
        );
        
    }

    async remove(driver_id) {
        this.setState({loaded: false})
        await remove_driver(driver_id)
        .then(async (response) => {
            this.refresh();
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    async setOnOff(driver_id, on_off) {
        this.setState({loaded: false})
        await setOnOff(driver_id, on_off)
        .then(async (response) => {
            this.setState({loaded: true})
            this.refresh();
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    editDriver(driver_id) {
        Actions.push("edit_driver", {driver_id : driver_id})
    }

    renderList() {
        return this.state.list.map((item, index) => {
            let country = item.country
            let countryName = '';
            if(Layout.Country_City && Layout.Country_City.length > 0) {
                Layout.Country_City.map((item, index) => {
                    if(country == item.value)
                        countryName = item.label
                })
            }
            return <View key={index} style={styles.section}>
                <View style={{width: '100%', flexDirection: 'row'}}>
                    {
                        item.is_online == 1 || item.is_online == 3 ?
                        <View style={{width: 15, height: 15, borderRadius: 8, backgroundColor: '#13652C', marginRight: 20, marginTop: 8}}>
                        </View>
                        :
                        <View style={{width: 15, height: 15, borderRadius: 8, backgroundColor: '#FA0116', marginRight: 20, marginTop: 8}}>
                        </View>
                    }
                    <TouchableOpacity style={{borderRadius: 10, backgroundColor: '#13652C', width: 80, paddingVertical: 5, marginRight: 15, alignItems: 'center'}} onPress={() => this.setOnOff(item.id, 3)}>
                        <Text style={{color: 'white'}}>Online</Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity style={{borderRadius: 10, backgroundColor: '#FA0116', width: 80, paddingVertical: 5, alignItems: 'center'}} onPress={() => this.setOnOff(item.id, 4)}>
                        <Text style={{color: 'white'}}>Offline</Text>
                    </TouchableOpacity>
                
                </View>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    {
                        item.car_picture ?
                            <Image source={{uri: 'http://149.28.78.240:5010/'+item.car_picture}} resizeMode="contain" resizeMethod="resize" style={{height: 100, width: 100}} />
                            :
                            <View style={{height: 100, width: 100}}></View>
                    }
                    
                    <View style={{flex: 1, marginLeft: 20}}>
                        <Text style={styles.label}>Name & surname : {item.user}</Text>
                        <Text style={styles.label}>Mail: {item.email}</Text>
                        <Text style={styles.label}>Phone: {item.phone_code} {item.phone}</Text>
                        <Text style={[styles.label, {flexWrap: 'wrap'}]}>Country & city : {countryName}</Text>
                        <Text style={styles.label}>Car Color: {item.car_color}</Text>
                        <Text style={styles.label}>Plate Number: {item.plate_no}</Text>
                        
                        <Text style={styles.label}>Car model: {item.kind}</Text>
                    </View>
                </View>
                <View style={{flex: 1, alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>

                    <TouchableOpacity style={{paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#FFCF00'}} onPress={() => this.editDriver(item.id)}>
                        <Text>Modify</Text>
                    </TouchableOpacity>

                    {
                        item.payment == "1" ?
                        <View style={{paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#89EC27'}}>
                            <Text style={{color: 'white'}}>Paid</Text>
                        </View>
                        :
                        <View style={{paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#CE1A12'}}>
                            <Text style={{color: 'white'}}>Not paid</Text>
                        </View>
                    }

                    <TouchableOpacity style={{paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#FFCF00'}} onPress={() => Actions.push("edit_driver")}>
                        <Text>Add driver</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#FA0100'}} onPress={() => this.removeDriver(item.id)}>
                        <Text style={{color: 'white'}}>Delete</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>
        })
    }

    render(){
        return (
            <View style={styles.container}>
                <Header isAdmin={true} />
                <ScrollView style={{flex: 1}} contentContainerStyle={{backgroundColor: '#e2e2e2'}}>
                    {
                        this.state.list && this.state.list.length > 0 ?
                        this.renderList()
                        :
                        null
                    }
                </ScrollView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
    
}

Admin.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2',
    },
    section: {
        paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 15,
        marginVertical: 10,
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 15,
        marginVertical: 10,
        alignItems: 'center'        
        alignItems: 'center'
    },
    label: {
        marginBottom: 5
    }
});
