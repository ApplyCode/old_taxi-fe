import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, SafeAreaView, AsyncStorage } from 'react-native';
import { showToast } from '../constants/Global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';

import OneSignal from 'react-native-onesignal'; // Import package from node modules
function myiOSPromptCallback(permission){
    // do something with permission value
}
export default class Initial extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            visible: false,
            onesignal_token: ''
        };
        OneSignal.inFocusDisplaying(2);
        OneSignal.init("c167fc9d-d6ff-41e0-bd84-05a10c074219", {kOSSettingsKeyAutoPrompt : true, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});
        //OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        OneSignal.setSubscription(true);
    }

    async onReceived(notification) {
        console.log('received', notification)
        if(notification.payload.additionalData && notification.payload.additionalData.type == 'driver accept') {
            await AsyncStorage.setItem("client_driver_id", notification.payload.additionalData.driver_id.toString())
            await AsyncStorage.setItem("client_booking_id", notification.payload.additionalData.booking_id.toString())
            await AsyncStorage.setItem("client_driver_phone", notification.payload.additionalData.phone.toString())
            await AsyncStorage.setItem("client_driver_name", notification.payload.additionalData.user_name.toString())
            if(Actions.currentScene != 'reservation')
                Actions.reset("root");
        } else if(notification.payload.additionalData && notification.payload.additionalData.type == 'finish') {
            let driver_id = await AsyncStorage.getItem("client_driver_id");
            
            let info = await AsyncStorage.getItem("user_info")
            if(info) {
                info = JSON.parse(info)
            }
            if(info.type == '1') {
                await AsyncStorage.removeItem("client_driver_id")
                await AsyncStorage.removeItem("client_booking_id")
                await AsyncStorage.removeItem("client_driver_phone")
                await AsyncStorage.removeItem("client_driver_name")
                Actions.push("rating", {driver_id : driver_id})
            }
            showToast("Finish Reservation", "success")
        } else if(notification.payload.additionalData && notification.payload.additionalData.type == 'request') {
            if(Actions.currentScene == 'booking' || Actions.currentScene == 'home')
                Actions.refresh();
        } else if(notification.payload.additionalData && notification.payload.additionalData.type == 'reservation cancel') {
            if(Actions.currentScene == 'booking' || Actions.currentScene == 'home')
                Actions.refresh();
            else
                Actions.reset("root");
        } else if(notification.payload.additionalData && notification.payload.additionalData.action == 'chat') {
            if(Actions.currentScene != 'chat')
                Actions.push("chat", {booking_id: notification.payload.additionalData.booking_id, type: notification.payload.additionalData.type});
        }
    }
    
    async onOpened(openResult) {
        console.log('opened', openResult.notification.payload.additionalData)
        if(openResult.notification.payload.additionalData && openResult.notification.payload.additionalData.type == 'request') {
            if(Actions.currentScene == 'booking' || Actions.currentScene == 'home')
                Actions.refresh();
            Actions.push("reservation" , {id: openResult.notification.payload.additionalData.booking_id, type: 'request'})
        } else if(openResult.notification.payload.additionalData && openResult.notification.payload.additionalData.type == 'driver accept') {
            await AsyncStorage.setItem("client_driver_id", openResult.notification.payload.additionalData.driver_id.toString())
            await AsyncStorage.setItem("client_booking_id", openResult.notification.payload.additionalData.booking_id.toString())
            await AsyncStorage.setItem("client_driver_phone", openResult.notification.payload.additionalData.phone.toString())
            await AsyncStorage.setItem("client_driver_name", notification.payload.additionalData.user_name.toString())

            Actions.push("home" , {booking_id: openResult.notification.payload.additionalData.booking_id, driver_id: openResult.notification.payload.additionalData.driver_id, phone:  openResult.notification.payload.additionalData.phone})
            //showToast("Driver Request Sent", "success")
        } else if(openResult.notification.payload.additionalData && openResult.notification.payload.additionalData.type == 'driver arrived') {
            showToast("Your driver has arrived and waiting you.", "success")
        } else if(openResult.notification.payload.additionalData && openResult.notification.payload.additionalData.type == 'finish') {
            let driver_id = await AsyncStorage.getItem("client_driver_id");
            
            let info = await AsyncStorage.getItem("user_info")
            if(info) {
                info = JSON.parse(info)
            }
            if(info.type == '1') {
                await AsyncStorage.removeItem("client_driver_id")
                await AsyncStorage.removeItem("client_booking_id")
                await AsyncStorage.removeItem("client_driver_phone")
                await AsyncStorage.removeItem("client_driver_name")
                Actions.push("rating", {driver_id : driver_id})
            }
            showToast("Finish Reservation", "success")
        } else if(openResult.notification.payload.additionalData && openResult.notification.payload.additionalData.type == 'reservation cancel') {
            if(Actions.currentScene == 'booking' || Actions.currentScene == 'home')
                Actions.refresh();
            else
                Actions.reset("root")
        } else if(openResult.notification.payload.additionalData && openResult.notification.payload.additionalData.action == 'chat') {
            if(Actions.currentScene != 'chat')
                Actions.push("chat", {booking_id: openResult.notification.payload.additionalData.booking_id, type: openResult.notification.payload.additionalData.type});
        }
    }

    async onIds(device) {
        console.log(device)
        if(device && device.userId)
            await AsyncStorage.setItem("onesignal_token", device.userId)
    }

    async componentDidMount(){
        let user_info = await AsyncStorage.getItem("user_info")
        let is_keep = await AsyncStorage.getItem("is_keep")
        if(user_info && is_keep)
            Actions.reset("root")
    }


    render(){
        return (
            <SafeAreaView style={styles.container}>
                
                    <View style={[styles.section, { }]}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={styles.title}>GUEST</Text>
                            <TouchableOpacity style={styles.btn} onPress={() => Actions.push("login", {type: 'client'})}>
                                <Text>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn} onPress={() => Actions.push("signup", {type: 'client'})}>
                                <Text>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: '100%'}}>
                            <Image source={require("../assets/images/taxi.jpg")} style={{height: '100%', width: '100%', marginTop: 10}} resizeMode="stretch" />
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text style={styles.title}>DRIVER</Text>
                            <TouchableOpacity style={styles.btn} onPress={() => Actions.push("login", {type: 'driver'})}>
                                <Text>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn} onPress={() => Actions.push("signup", {type: 'driver'})}>
                                <Text>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, width: '100%'}}>
                            <Image source={require("../assets/images/processed2.jpeg")} style={{height: '100%', width: '100%', marginTop: 10}} resizeMode="stretch" />
                        </View>
                    </View>
                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </SafeAreaView>
        );
    }
    
}

Initial.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 30
    },
    section: {
        flex: 1, paddingTop: 20, alignItems: 'center'
    },
    btn: {
        backgroundColor: '#ffc500',
        paddingVertical: 10,
        width: 200,
        alignItems: 'center',
        marginTop: 15,
        borderRadius: 5
    }
});
