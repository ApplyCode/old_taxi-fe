import React, { Component } from 'react';
import { Platform, TextInput, View, Image, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {Actions} from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
export default class MainHeader extends Component {

  constructor(props) {
    super(props);
    this.state = { 
    };
  }
  render() {
    return (
      <View style={styles.header}>
        {
          this.props.isAdmin ?
            <View style={{justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => Actions.pop()}>
                <Icon type="feather" name="arrow-left" size={30} color="black" />
              </TouchableOpacity>
            </View>
            :
            <View style={{justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => Actions.drawerOpen()}>
                <Icon type="entypo" name="menu" size={30} color="black" />
              </TouchableOpacity>
              <Text style={{color: 'black', paddingLeft: 10, fontSize: 16}}>{ this.props.title ? this.props.title : 'Taxiwait Driver'}</Text>
            </View>
        }
        
        {
          this.props.isOnline ?
          <Text style={{color: 'black', paddingLeft: 10, fontSize: 16, paddingRight: 20}}>Online</Text>
          :
          null
        }
      </View>
    )
  }
}


