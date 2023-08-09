import React, { Component } from 'react';
import { Platform, TextInput, View, Image, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {Actions} from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements';
export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
  }

  componentDidMount() {
  }

  async logout() {
    await AsyncStorage.clear();
    Actions.reset("initial")
  }

  render() {
    return (
      <>
      {
        this.props.isAdmin ?
        <View style={[styles.header, {justifyContent: 'flex-end', alignItems: 'flex-end'}]}>
          <TouchableOpacity style={[styles.menuSection, {paddingRight: 20}]} onPress={() => this.logout()}>
              <Icon type="antdesign" name="logout" size={30} color="black" />
          </TouchableOpacity>
        </View>
        :
        <View style={styles.header}>
          <Text style={{color: 'black', paddingLeft: 20, fontSize: 16}}>{this.props.title}</Text>        
        </View>
      }
        
      </>
      
    )
  }
}

const styles = StyleSheet.create({
    header: {
        height: 50,
        backgroundColor: '#ffc500',
        justifyContent: 'center'
    },
    menuSection: {
      paddingLeft: 50, paddingVertical: 10
  }
})