import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Text,
  View,
  Pressable,
  Image
} from "react-native";
import { colors } from "../global/Color";
import Icon from 'react-native-vector-icons/AntDesign'
import { globalAPI } from "../global/globalAPI_URI";

export default function ForgotPassword({navigation}) {

  // setting email address and focus event
    const [email,setEmail] = useState('')
    const [emailColor, setEmailColor] = useState('#F5F9FE');

    // calling api to send code on given emails
    const requestResetCode=async ()=>{
        const data=JSON.stringify({
          email: email
        })
        console.log(data)
        const item = await fetch(globalAPI+"request-reset-password-code", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: data
        })
        if(item.status===200){
          console.log(item)
          navigation.navigate('EnterCodeScreen',{email:email})
        }
        else{
          alert('Error! Please try again..')
      }
    }

  return (
      <View style={styles.container}>
        <Pressable style={{marginHorizontal:'8%',marginTop:'12%',marginBottom:'8%'}}
            onPress={()=>navigation.goBack()}
        >
            <Icon 
                name='arrowleft'
                size={24}
                color={colors.softBack}
            />
        </Pressable>
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginVertical:'7%'}}>
            <View style={{...styles.barLine,borderColor:colors.baumBlue}}></View>
            <View style={styles.barLine}></View>
            <View style={styles.barLine}></View>
        </View>
        <Image
          source={require("../../assets/images/Wave.png")}
          style={{
            width: 220,
            height: 80,
            marginVertical: '10%',
            alignSelf:'center'
          }}
          resizeMode="contain"
        />

        <Text style={styles.text1}>Enter Email</Text>
{/*         <Text style={styles.textDes}>
        Don’t worry, we got you :)
        </Text> */}
        <View style={{marginHorizontal:5,marginTop:'12%'}}>
          <TextInput style={{...styles.input,borderColor:emailColor}} placeholder="Email Address" 
            placeholderTextColor={'#7C8BA0'}
            onFocus={()=>setEmailColor(colors.baumBlue)}
            onBlur={()=>setEmailColor('#F5F9FE')}
            value={email}
            onChangeText={(t)=>setEmail(t)}
          />
        </View>
        <View style={{alignItems:'center'}}>
          <TouchableOpacity style={styles.ForgotButton} onPress={requestResetCode}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardbackground,
    flex:1
  },
  text1: {
    color: colors.baumBlue,
    fontSize: 32,
    textAlign:'center',
    fontWeight:'600'
  },
  textDes: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: '#61677D',
    marginTop: 10,
  },
  input: {
    margin: 10,
    borderWidth: 1,
    padding: 10,
    width: SCREEN_WIDTH*.92,
    height: 60,
    backgroundColor: colors.textBack,
    borderWidth: 1,
    borderRadius: 14,
    marginTop:5,
    fontSize:16,
    fontWeight:'400',
    lineHeight:24,
    color:'#262626',
    paddingLeft:24
  },
  ForgotButton: {
    backgroundColor:colors.baumBlue,
    padding: 10,
    width: SCREEN_WIDTH*.92,
    height: 60,
    borderRadius: 14,
    justifyContent:'center',
    alignItems:'center',
    marginTop:'6%',
    marginBottom:'3%',
    shadowColor: colors.buttons,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,  
    elevation: 20,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color:colors.cardbackground
  },
  barLine:{
    width:40,
    borderWidth:2,
    borderColor:colors.nonSelected,
    marginLeft:7,
    borderRadius:2
  },
});
