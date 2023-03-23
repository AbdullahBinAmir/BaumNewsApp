import React,{useState} from "react";
import {
  StyleSheet,
  TextInput,
  StatusBar,
  Text,
  View,
  Pressable,
  Image,
  Dimensions
} from "react-native";
import { colors } from "../global/Color";
import Icon from 'react-native-vector-icons/AntDesign'
import { globalAPI } from "../global/globalAPI_URI";

const   SCREEN_WIDTH = Dimensions.get('window').width   
//const   SCREEN_HEIGHT = Dimensions.get('window').height   

export default function EnterCodeScreen({navigation,route}) {

  // setting numbers and their focus events
  const [num1,setNum1] = useState(0)
  const [num1Color,setNum1Color] = useState(colors.inputField)
  const [num2,setNum2] = useState(0)
  const [num2Color,setNum2Color] = useState(colors.inputField)
  const [num3,setNum3] = useState(0)
  const [num3Color,setNum3Color] = useState(colors.inputField)
  const [num4,setNum4] = useState(0)
  const [num4Color,setNum4Color] = useState(colors.inputField)
  const [num5,setNum5] = useState(0)
  const [num5Color,setNum5Color] = useState(colors.inputField)

  // calling api to chech wether entered code matches the code that had been sent
  const verifyResetCode = async ()=>{
    try{
      const data=JSON.stringify({
        email: route.params.email,
        resetPasswordCode:`${num1}${num2}${num3}${num4}${num5}`
      })
      const response = await fetch(`${globalAPI}verify-reset-password-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
    })
    const responseJson = await response.json()
    if(response.status===200){
      navigation.navigate('ResetPasswordScreen',{data:responseJson})
    }
    else {
      alert(responseJson?.message)
    }
    }
    catch(error){
      alert('Sorry!' + error )
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
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginBottom:60}}>
            <View style={styles.barLine}></View>
            <View style={{...styles.barLine,borderColor:colors.baumBlue}}></View>
            <View style={styles.barLine}></View>
        </View>
        <Image
          source={require("../../assets/images/Wave.png")}
          style={{
            width: 220,
            height: 80,
            backgroundColor: "transparent",
            marginBottom: 25,
            alignSelf:'center'
          }}
          resizeMode="contain"
        />

        <View style={{marginTop:'2%'}}>
          <Text style={styles.text1}>Enter Code</Text>
        </View>
        <View style={{marginTop:'2%'}}>
          <Text style={styles.textDes}>
              Please enter the five digit code sent to
          </Text>
        </View>
        <Text style={styles.textDes}>
            {route.params.email}
        </Text>
        <View style={{width:SCREEN_WIDTH*.90,flexDirection:'row',marginLeft:10}}>
          <TextInput style={{...styles.input,borderColor:num1Color}}
            onFocus={()=>setNum1Color(colors.buttons)}
            onBlur={()=>setNum1Color('#F5F9FE')}
            maxLength={1}
            value={num1}
            onChangeText={(t)=>setNum1(t)}
            keyboardType='number-pad'
          />
          <TextInput style={{...styles.input,borderColor:num2Color}}
            onFocus={()=>setNum2Color(colors.buttons)}
            onBlur={()=>setNum2Color('#F5F9FE')}
            value={num2}
            maxLength={1}
            onChangeText={(t)=>setNum2(t)}
            keyboardType='number-pad'
          />
          <TextInput style={{...styles.input,borderColor:num3Color}}
            onFocus={()=>setNum3Color(colors.buttons)}
            onBlur={()=>setNum3Color('#F5F9FE')}
            value={num3}
            maxLength={1}
            onChangeText={(t)=>setNum3(t)}
            keyboardType='number-pad'
          />
          <TextInput style={{...styles.input,borderColor:num4Color}}
            onFocus={()=>setNum4Color(colors.buttons)}
            onBlur={()=>setNum4Color('#F5F9FE')}
            value={num4}
            maxLength={1}
            onChangeText={(t)=>setNum4(t)}
            keyboardType='number-pad'
          />
          <TextInput style={{...styles.input,borderColor:num5Color}}
            onFocus={()=>setNum5Color(colors.buttons)}
            onBlur={()=>setNum5Color('#F5F9FE')}
            value={num5}
            maxLength={1}
            onChangeText={(t)=>setNum5(t)}
            keyboardType='number-pad'
          />
        </View>
        <View style={{alignItems:'center'}}>
          <Pressable style={styles.ForgotButton} onPress={verifyResetCode}>
            <Text style={styles.btnText}>Continue</Text>
          </Pressable>
        </View>
        <View style={{flexDirection:'row',marginLeft:'10%'}}>
            <Text style={styles.textDes}>
                Didn't get Code?
            </Text>
            <Text style={{...styles.textDes,color:colors.baumBlue}}>
                {' '}Resend Code
            </Text>
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
    color: colors.softBack,
    marginTop: 1,
  },
  input: {
    margin: 5,
    borderWidth: 1,
    padding: 10,
    width: SCREEN_WIDTH*.16,
    height: 70,
    backgroundColor: "#F5F9FE",
    borderWidth: 1,
    borderRadius: 14,
    marginTop:'8%',
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
    shadowColor: '#4B91F1',
    shadowOffset: { width: 0, height:10},
    shadowOpacity: .5,
    shadowRadius: 14,
    elevation:10
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
