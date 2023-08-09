import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, Platform, ScrollView } from 'react-native';
import { showToast } from '../constants/Global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import MainHeader from '../components/MainHeader';
import AsyncStorage from '@react-native-community/async-storage';

export default class Privacy extends React.Component {
    constructor(props){
        super(props);
        this.mapRef = null
        this.state = {
            loaded: true,
            type: ''
        };
        
    }

    async componentDidMount(){
        let userInfo = await AsyncStorage.getItem("user_info")
        if(userInfo) {
            userInfo = JSON.parse(userInfo)
            this.setState({type: userInfo.type})
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <MainHeader />
                <ScrollView style={{flex: 1, padding: 20, marginBottom: 20}}>
                    
                        <Text style={{lineHeight: 20}}>
                        First of all, your privacy is important to us. Yes, we know that everyone says it, but for us it really is. You have trusted us using the services of taxiwait.com and we greatly appreciate it. This means that we will strive to protect and protect any personal data by acting in the interest of our customers and with transparency regarding the processing of your personal data.{'\n'}{'\n'}

                        This page is used to inform you regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.{'\n'}{'\n'}

                        And you are aware about paying a non refundable amount each month to taxiwait to publish your car.{'\n'}{'\n'}

                        In case you deside to stop working with us is enaugh to tell us by mail.{'\n'}{'\n'}

                        If you choose to use our Services, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. we will not use or share your information with anyone except as described in this Privacy Policy.{'\n'}{'\n'}

                        The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at taxiwait Center unless otherwise defined in this Privacy Policy.{'\n'}{'\n'}

                        Information Collection and Use{'\n'}{'\n'}

                        For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including Phone number. The information that we request used as described in this privacy policy.{'\n'}{'\n'}

        Security{'\n'}{'\n'}

        We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it.{'\n'}{'\n'}

We safley keep your private information confidential. You can trust that all your data is transferred and restored using encryption and is kept behind secured firewalls on our Private Cloud Network, your payment information is kept safe with a PCI Compilant and world renowned payment gateway.{'\n'}{'\n'}

The next generation of getting taxi clients is Taxiwait at your fingertips.{'\n'}{'\n'}

If you download the app and it's not available yet in your city please contact us directly, let us know wish city you reside and you will be on the first list of drivers to enjoy this app within couple of days or weeks.{'\n'}{'\n'}

Changes to This Privacy Policy{'\n'}{'\n'}

We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. we will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.{'\n'}{'\n'}

Give us a try and please rate us.{'\n'}{'\n'}
                        </Text>
                    
                    <Text style={{marginBottom: 30, textAlign: 'center'}}>Copyright©taxiwait 2020</Text>
                </ScrollView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
    
}

Privacy.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});