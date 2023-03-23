import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  Image,
  Dimensions
} from "react-native";
import { colors } from "../global/Color";
import Icon from 'react-native-vector-icons/AntDesign'
import Icon1 from 'react-native-vector-icons/Feather'
import Icon2 from 'react-native-vector-icons/Ionicons';
import { globalAPI } from "../global/globalAPI_URI";

const  SCREEN_WIDTH = Dimensions.get('window').width

// recieving token from previous that has been genereted after verifying code
export default function ResetPasswordScreen({navigation,route}) {

    // console.log(route.params)
    // setting states
    const [password, setPassword] = useState('');
    const [passwordColor, setPasswordColor] = useState('#F5F9FE');
    const [hide,setHide] = useState(true)
    const [repassword, setRePassword] = useState('');
    const [repasswordColor, setRePasswordColor] = useState('#F5F9FE');
    const [rhide,setRHide] = useState(true)
    const [isRequested,setIsrequested] = useState(false)
    const [passwordCheck,setPasswordCheck] = useState(false)

    // updating new password in the database
    const resetPassword = ()=>{
      if(password!==repassword || password.length<=8){
        setPasswordCheck(true)
      }
      else{
        try{
          const data=JSON.stringify({
            resetPasswordToken: route.params.data.resetPasswordToken,
            password: password
          })
          fetch(`${globalAPI}reset-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: data
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            alert(responseJson?.message)
            navigation.navigate('SignIn')
          })
          .catch((error) => {
            alert(error);
          });
        }
        catch(error){
          alert('Sorry!' + error )
        }
      }
    }

  return (
      <View style={styles.container}>
        <Pressable style={{marginHorizontal:25,marginVertical:36}}
            onPress={()=>navigation.goBack()}
        >
            <Icon 
                name='arrowleft'
                size={24}
                color={colors.softBack}
            />
        </Pressable>
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginVertical:'5%'}}>
            <View style={styles.barLine}></View>
            <View style={styles.barLine}></View>
            <View style={{...styles.barLine,borderColor:colors.baumBlue}}></View>
        </View>
        <Image
          source={require("../../assets/images/Wave_1.png")}
          style={{
            width: 220,
            height: 80,
            backgroundColor: "transparent",
            marginVertical: '10%',
            alignSelf:'center'
          }}
          resizeMode="contain"
        />

        <Text style={styles.text1}>Reset Password</Text>
{/*         <Text style={styles.textDes}>
            Set a strong one :)
        </Text> */}
        <View  style={{flexDirection:'row',alignItems:'center',marginHorizontal:5,marginTop:'7%'}}>
          <TextInput style={{...styles.input,borderColor:passwordColor}} placeholder="Password" secureTextEntry={hide} 
            placeholderTextColor={'#7C8BA0'}
            onFocus={()=>setPasswordColor(colors.buttons)}
            onBlur={()=>setPasswordColor('#F5F9FE')}
            value={password}
            onChangeText={(t)=>setPassword(t)}
          />
          <View style={{right:50}}>
            <Icon2 name="eye-off-outline" color={hide?'#7C8BA0':colors.black} size={25} 
              onPress={()=>setHide(!hide)}
            />
         </View>
        </View>
        <View  style={{flexDirection:'row',alignItems:'center',marginHorizontal:5}}>
          <TextInput style={{...styles.input,borderColor:repasswordColor}} placeholder="Confirm Password" secureTextEntry={rhide} 
            placeholderTextColor={'#7C8BA0'}
            onFocus={()=>setRePasswordColor(colors.buttons)}
            onBlur={()=>setRePasswordColor('#F5F9FE')}
            value={repassword}
            onChangeText={(t)=>setRePassword(t)}
          />
          <View style={{right:50}}>
            <Icon2 name="eye-off-outline" color={rhide?'#7C8BA0':colors.black} size={25} 
              onPress={()=>setRHide(!rhide)}
            />
         </View>
        </View>
        { passwordCheck?(
        <Text style={styles.passwordMatch}>
        Password should be longer than eight characters
        </Text>):null
        }
        <View style={{alignItems:'center'}}>
        {!isRequested?(
          <Pressable style={styles.ForgotButton}
            onPress={resetPassword}
          >
            <Text style={styles.btnText}>Submit</Text>
          </Pressable>
          ):(
          <Pressable style={styles.ForgotButton}
            onPress={()=>alert('wait for response!')}
          >
              <Icon1 
                  name='loader'
                  size={24}
                  color={colors.cardbackground}
                  style={{right:10}}
              />
            <Text style={styles.btnText}>Submitting..</Text>
          </Pressable>)}
        </View>
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
    backgroundColor: "#F5F9FE",
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
    flexDirection:'row',
    alignItems:'center',
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
  passwordMatch:{
    fontSize: 12,
    lineHeight: 14.52,
    color: "#F30F0F",
    marginLeft:20
  },
});
