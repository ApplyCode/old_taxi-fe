import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, Platform, ScrollView, AsyncStorage } from 'react-native';
import { showToast } from '../constants/Global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import MainHeader from '../components/MainHeader';
import StarRating from 'react-native-star-rating';
import { is_favorite_driver, rating_driver, favorite_driver } from '../constants/Api';
import { Actions } from 'react-native-router-flux';
export default class Rating extends React.Component {
    constructor(props){
        super(props);
        this.mapRef = null
        this.state = {
            loaded: true,
            payments: [
                {label: 'Cash', value: '0' },
                {label: 'Paypal', value: '1' }
            ],
            pay: '',
            starStore: 0,
            driverList: [{driver_id: 10}],
            userInfo: null,
            is_favorite: 0,
            is_rating: 0
        };
        
    }

    async componentDidMount(){
        console.log(this.props.driver_id)
        let info = await AsyncStorage.getItem("user_info")
        if(info) {
            info = JSON.parse(info)
            this.setState({userInfo: info})
        }
        if(this.props.driver_id) {
            await is_favorite_driver(this.props.driver_id, info.id)
            .then(async (response) => {
                if(response.data && response.data.id) {
                    this.setState({is_favorite: 1})
                }
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }
    }

    onStarRatingStore(rating) {
        this.setState({starStore: rating});
    }

    async starRating() {
        if(this.state.starStore) {
            this.setState({loaded: false});
            console.log(this.props.driver_id, this.state.userInfo.id, this.state.starStore)
            await rating_driver(this.props.driver_id, this.state.userInfo.id, this.state.starStore)
            .then(async (response) => {
                console.log(response)
                this.setState({loaded: true});
                this.setState({is_rating: 1});
                if(this.state.is_favorite)
                    Actions.drawerOpen();
            })
            .catch((error) => {
                console.log('error', error)
                this.setState({loaded: true});
                showToast();
            });
        } else {
            Alert.alert("Please select rating star.")
        }
        
    }

    async addFavorite() {
        this.setState({loaded: false});
        await favorite_driver(this.props.driver_id, this.state.userInfo.id)
        .then(async (response) => {
            this.setState({loaded: true});
            this.setState({is_favorite: 1})
            if(this.state.is_rating)
                Actions.drawerOpen();
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    render(){
        return (
            <View style={styles.container}>
                <MainHeader />
                <ScrollView style={{flex: 1}}>
                    <View>
                        {
                            this.state.is_rating ?
                            null
                            :
                            <View>
                                <Text style={{fontSize: 20, fontWeight: 'bold', paddingBottom: 20, textAlign: 'center', marginTop: 20}}>
                                    Please give your driver a star
                                </Text>
                                <View style={{paddingBottom: 30}}>
                                    <StarRating
                                        disabled={false}
                                        maxStars={5}
                                        buttonStyle={{marginHorizontal: 10}}
                                        fullStarColor={"#ffc500"}
                                        emptyStarColor={"#d3d3d3"}
                                        containerStyle={{justifyContent: 'center'}}
                                        rating={this.state.starStore}
                                        selectedStar={(rating) => this.onStarRatingStore(rating)}
                                    />
                                    <View style={{alignItems: 'center', marginTop: 30}}>
                                        <TouchableOpacity style={{borderRadius: 10, paddingVertical: 10, width: 200, backgroundColor: '#337ab7', alignItems: 'center', justifyContent: 'center'}} onPress={() => this.starRating()}>
                                            <Text style={{color: 'white', textAlign: 'center'}}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }
                        
                        {
                            !this.state.is_favorite ?
                            <View>
                                <View style={{marginVertical: 15}}>
                                    <Text style={{textAlign: 'center', fontSize: 20}}>Add your Best Driver</Text>
                                </View>
                                <View style={{marginVertical: 15}}>
                                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => this.addFavorite()}>
                                        <Image source={require("../assets/images/favorite.jpg")} style={{height: 50}} resizeMode="contain" />
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                            :
                            null
                        }
                        <View style={{marginVertical: 15}}>
                            <Text style={{textAlign: 'center', fontSize: 20}}>Thank you to rate your driver</Text>
                        </View>
                    </View>
                </ScrollView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
}

Rating.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    
});