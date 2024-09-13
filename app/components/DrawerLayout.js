import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, Platform, SafeAreaView, Switch, Share } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating';
import { set_online, get_driver_ratings } from '../constants/Api';
import { showToast } from '../constants/Global';
export default class DrawerLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            noticeNotify: false,
            info: null,
            is_online: true,
            vote_count: 0,
            rating: 0
        };
        
    }
    async componentDidMount(){
        
        let info = await AsyncStorage.getItem("user_info")
        if(info) {
            info = JSON.parse(info)
            this.setState({info})
            this.get_rating(info['id'])
            if(info['is_online'] == 1 || info['is_online'] == 3)
                this.setState({is_online: true})
            else
                this.setState({is_online: false})
        }
    }

    async get_rating(id) {
        if( id !== 1) {
            this.setState({loaded: false})
            await get_driver_ratings(id)
            .then(async (response) => {
                this.setState({loaded: true})
                if(response.data) {
                    this.setState({vote_count: response.data[0].count})
                    this.setState({rating: response.data[0].rating})
                }
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }
    }

    async UNSAFE_componentWillReceiveProps() {
        if(this.state.info && this.state.info['id'])
            this.get_rating(this.state.info['id'])
    }
    async logout() {
        await AsyncStorage.clear();
        Actions.reset("initial")
    }

    share() {
        Share.share({
            message: "Taxiwait Driver"
        })
    }

    onStarRating(rating) {
        
    }

    toggleSwitch = async () => {
        if(this.state.info.is_online != 4) {
            this.setState({is_online: !this.state.is_online})
            let info = await AsyncStorage.getItem("user_info")
            if(info) {
                info = JSON.parse(info)
                this.setState({loaded: false})
                await set_online(info['id'], this.state.is_online)
                .then(async (response) => {
                    await AsyncStorage.setItem("driver_online", this.state.is_online.toString())
                    this.setState({loaded: true});
                })
                .catch((error) => {
                    this.setState({loaded: true});
                    showToast();
                });
            }
        }
        
    }

    render() {
        return (
                <View style={styles.container}>
                    {
                        this.state.info && this.state.info.type == '1' ?
                        <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 10, backgroundColor: 'white'}}>
                            <Image source={require("../assets/images/logo.jpg")} style={{width: 100, height: 100}} resizeMode={"contain"} />    
                        </View>
                        :
                        this.state.info && this.state.info.type == '0' ?
                        <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: 10, backgroundColor: 'white'}}>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    buttonStyle={{marginHorizontal: 2}}
                                    fullStarColor={"#F3CC02"}
                                    emptyStarColor={"#d3d3d3"}
                                    rating={this.state.rating}
                                    starSize={20}
                                    selectedStar={(rating) => this.onStarRating(rating)}
                                />
                                <Text style={{marginTop: 15}}>{this.state.vote_count > 1 ? this.state.vote_count+" votes" : this.state.vote_count+" vote"}</Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                {
                                    this.state.info.car_picture ?
                                    <Image source={{uri: 'http://149.28.78.240:5010/'+this.state.info.car_picture}} style={{width: 80, height: 80}} resizeMode={"contain"} />
                                    :
                                    <Image source={require("../assets/images/logo.jpg")} style={{width: 100, height: 100}} resizeMode={"contain"} />    
                                }
                                

                            </View>
                        </View>
                        :
                        null
                    }
                    
                    <ScrollView style={{flex: 1}} contentContainerStyle={{backgroundColor: '#ffc500', flex: 1}}>
                        <View style={{flex: 1}}>
                            <View>
                                <TouchableOpacity style={[styles.menuSection, {alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: this.state.info && this.state.info.type == '0' ? 25 : 50}]} onPress={() => Actions.push("myprofile")}>
                                    <Text>My Profile</Text>
                                    {
                                        this.state.info && this.state.info.type == '0' ?
                                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 50}}>
                                            <Switch
                                                trackColor={{ false: "#767577", true: "#767577" }}
                                                thumbColor={this.state.is_online ? "#81c94c" : "#ff1313"}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={this.toggleSwitch}
                                                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                                                value={this.state.is_online}
                                            />
                                            {
                                                this.state.is_online ?
                                                <Text style={{marginLeft: 10, fontSize: 18}}>Online</Text>
                                                :
                                                <Text style={{marginLeft: 10, fontSize: 18}}>Offline</Text>
                                            }
                                        </View>
                                        :
                                        null
                                    }
                                    
                                </TouchableOpacity>
                                {
                                    this.state.info && this.state.info.type == '1' ?
                                    <TouchableOpacity style={styles.menuSection} onPress={() => Actions.reset("root")}>
                                        <Text>Your Destination</Text>
                                    </TouchableOpacity>
                                    :
                                    this.state.info && this.state.info.type == '0' ?
                                    <TouchableOpacity style={[styles.menuSection, {paddingLeft: 25}]} onPress={() => Actions.push("booking")}>
                                        <Text>Bookings</Text>
                                    </TouchableOpacity>
                                    :
                                    null
                                }
                                {
                                    this.state.info && this.state.info.type == '1' ?
                                    <View>
                                        <TouchableOpacity style={styles.menuSection} onPress={() => Actions.push("driverlist")}>
                                            <Text>Rate and favourites driver</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.menuSection} onPress={() => Actions.push("privacy")}>
                                            <Text>Privacy Policy & Conditions</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.menuSection} onPress={() => Actions.push("contactus")}>
                                            <Text>Contact Us</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.menuSection}>
                                            <View style={{position: 'absolute', top: 15, left: 13}}>
                                                <Image source={require("../assets/images/cash.jpeg")} style={{width: 30, height: 30}} resizeMode="contain" />
                                            </View>
                                            <Text>Pay In Cash</Text>
                                            <Text>Ride and pay the driver directly</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.menuSection} onPress={() => Actions.push("pay")}>
                                            <View style={{position: 'absolute', top: 15, left: 13}}>
                                                <Image source={require("../assets/images/pay.png")} style={{width: 30, height: 30}} resizeMode="contain" />
                                            </View>
                                            <Text>PayPal</Text>
                                            <Text>Link to your paypal account</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    this.state.info && this.state.info.type == '0' ?
                                    <View>
                                        <TouchableOpacity style={[styles.menuSection, {paddingLeft: 25}]} onPress={() => Actions.push("driverpay")}>
                                            <Text>Your monthly payment to be active</Text>
                                            <View style={{flexDirection: 'row', flex: 1, paddingRight: 30, paddingBottom: 0, paddingTop: 5}}>
                                                <View style={{flex: 1}}></View>
                                                <Image source={require("../assets/images/visa.png")} style={{flex: 1, height: 15, width: '100%', marginRight: 3}} resizeMode="stretch" />
                                                <Image source={require("../assets/images/master.png")} style={{flex: 1, height: 15, width: '100%', marginRight: 3}} resizeMode="stretch" />
                                                <Image source={require("../assets/images/maestro.png")} style={{flex: 1, height: 15, width: '100%', marginRight: 3}} resizeMode="stretch" />
                                                <Image source={require("../assets/images/express.png")} style={{flex: 1, height: 15, width: '100%', marginRight: 3}} resizeMode="stretch" />
                                                <View style={{flex: 1}}></View>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.menuSection, {paddingLeft: 25}]} onPress={() => Actions.push("privacy")}>
                                            <Text>Privacy Policy & Conditions</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.menuSection, {paddingLeft: 25}]} onPress={() => Actions.push("support")}>
                                            <Text>Support</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    null
                                }
                                
                            </View>
                            {
                                <View style={{paddingBottom: 20, flexDirection: 'row', }}>
                                    <View>
                                        <TouchableOpacity style={[styles.menuSection, {paddingLeft: this.state.info && this.state.info.type == '0' ? 25 : 50}]} onPress={() => this.logout()}>
                                            <Text style={{paddingBottom: 10}}>Logout</Text>
                                            <Icon type="antdesign" name="logout" size={30} color="black" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.menuSection, {paddingLeft: this.state.info && this.state.info.type == '0' ? 25 : 50}]} onPress={() => this.share()}>
                                            <Text style={{paddingBottom: 10}}>Share</Text>
                                            <Icon type="entypo" name="share" size={30} color="black" style={{paddingRight: 8}} />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={{alignItems: 'center',justifyContent: 'center', flex: 1}} onPress={() => Actions.drawerClose()}>
                                        <Image source={require("../assets/images/processed4.png")} style={{width: 60, height: 60}}  />
                                    </TouchableOpacity>
                                </View>
                            }
                            
                        </View>
                        <View style={{width: '100%', height: 100}}>
                            <Image source={require("../assets/images/taxi1.jpg")} style={{width: '100%', height: 120}} resizeMode="stretch" />
                        </View>
                    </ScrollView>
                    
                </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex' ,
        justifyContent: 'space-between' ,
        flex: 1,
        backgroundColor: '#ffc500'
    },
    menuSection: {
        paddingLeft: 50, paddingVertical: 10
    }
});
