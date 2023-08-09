import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Switch, Platform, SafeAreaView, TextInput } from 'react-native';
import { showToast } from '../constants/Global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { support } from '../constants/Api';
import MainHeader from '../components/MainHeader';

export default class Support extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            sender_name: '',
            email: '',
            title: '',
            description: '',
            emailError: false,
            titleError: false,
            descError: false
        };
    }
    

    async componentDidMount(){
        
    }

    async send() {
        let valid = true
        if(this.state.email == '') {
            this.setState({emailError: true})
            valid = false
        } else {
            this.setState({emailError: false})
        }
        if(this.state.title == '') {
            this.setState({titleError: true})
            valid = false
        } else {
            this.setState({titleError: false})
        }
        if(this.state.description == '') {
            this.setState({descError: true})
            valid = false
        } else {
            this.setState({descError: false})
        }
        if(valid) {
            this.setState({loaded: false})
            await support(this.state.sender_name, this.state.email, this.state.title, this.state.description)
            .then(async (response) => {
                this.setState({loaded: true});
                Actions.reset("root")
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader/>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true} style={{flex: 1}}>
                    <View style={{padding: 20}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20, paddingBottom: 20}}>Contact Us</Text>
                        <Text style={{paddingBottom: 5}}>Your Name</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={sender_name => this.setState({ sender_name })}
                            value={this.state.sender_name}
                        />

                        <Text style={{paddingBottom: 5}}>Email</Text>
                        <TextInput
                            style={this.state.emailError ? [styles.input, styles.error] : styles.input}
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        />

                        <Text style={{paddingBottom: 5}}>Subject</Text>
                        <TextInput
                            style={this.state.titleError ? [styles.input, styles.error] : styles.input}
                            onChangeText={title => this.setState({ title })}
                            value={this.state.title}
                        />

                        <Text style={{paddingBottom: 5}}>Description</Text>
                        <TextInput
                            style={this.state.descError ? [styles.input, styles.error, {height: 100, textAlignVertical: 'top'}] : [styles.input, {height: 100, textAlignVertical: 'top'}]}
                            onChangeText={description => this.setState({ description })}
                            numberOfLines={6}
                            multiline={true}
                            value={this.state.description}
                        />
                        
                        
                        <TouchableOpacity style={{alignItems: 'center', marginTop: 15}} onPress={() => this.send()}>
                            <View style={{backgroundColor: '#68ae34', paddingVertical: 10, width: 150, borderRadius: 5, alignItems: 'center', flex: 1}}>
                                <Text style={{color: 'white', textAlign: 'center', fontSize: 20}}>Send</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </SafeAreaView>
        );
    }
    
}

Support.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    input: { 
        height: 50, fontSize: 14, paddingHorizontal: 12, borderColor: '#737373', borderWidth: 1, borderRadius: 6,
        backgroundColor: '#F7F8F9',
        marginBottom: 20
    },
    error: {
      borderWidth: 1,
      borderColor: '#EA3223'
    }    
});
