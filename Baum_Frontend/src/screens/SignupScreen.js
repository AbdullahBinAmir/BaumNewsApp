import React,{useState,useEffect} from "react";
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  ScrollView,
  Modal,
  Linking,
  Platform,
  ActivityIndicator
} from "react-native";
import { Image } from "react-native";
import { colors } from "../global/Color";
import Icon from 'react-native-vector-icons/Ionicons';
import InformationModal from "../components/InformationModal";
import { globalAPI } from "../global/globalAPI_URI";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

const  SCREEN_WIDTH = Dimensions.get('window').width
const  SCREEN_HEIGHT = Dimensions.get('window').height

export default function SignUp({navigation}) {

  const [uri, setURL] = useState("");

  // calling on signup button to register a user
  const UserRegisteration=async ()=>{
    setPasswordCheck(false)
    setEmailCheck(false)
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!email || !password){
      setPasswordCheck(true)
    }
    if(password?.length <= 8 ){
      setPasswordCheck(true)
    }
    if(!email.match(pattern)){
      setEmailCheck(true)
    }
    if(!passwordCheck && !emailCheck){
      const data=JSON.stringify({
        email: email,
        password: password
      })
      //console.log(data)
      const item = await fetch(globalAPI+"register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data
      })
      if(item.status===200){
        setModalVisible(true)
        //console.log(item)
      }
    }
  }

  // handle user data on redirect
  const handleOpenURL = (url) => {
    // Extract stringified user string out of the URL
    const user = decodeURI(url).match(
      /email=([^#]+)\/pass=([^#]+)\/status=([^#]+)/
    );
    // 2 - store data in Redux
    const userData = {
      //some users on fb may not registered with email but rather with phone
      email: user && user[1] ? user[1] : "NA",
      pass: user[2],
      status: user[3],
    };
    console.log(userData);
    LoginWithGoogle(userData)
      setURL("");
  };

  const openUrl = (url) => {
      setURL(url);
  };

  useEffect(()=>{
    Linking.addEventListener("url", (url) => handleOpenURL(url.url));
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleOpenURL({ url });
      }
    });
    return () => {
      Linking.removeAllListeners("url");
    };
  },[])

  // login with google nad facebook, save user data
  const LoginWithGoogle=async (ugdata)=>{
    // console.log('userData',email+' '+password)
    // console.log(ugdata)
      const item = await fetch(`${globalAPI}loginwithgoogle?email=${ugdata.email}&password=${ugdata.pass.toString()}`, {
        method: 'POST',
        headers: {
          'Accept':'application/json',
          'Content-Type': 'application/json'
        }
      })
      const data = await item.json()
      console.log(data)
      if(item.status===200){
        const value = await AsyncStorage.getItem('user_token')
        await AsyncStorage.setItem('session_token', data._id);
        await AsyncStorage.setItem('user_token','0');
        globalThis.userData=data
        value==='1' ? navigation.navigate('HomeBottomNav') : navigation.navigate('IntersestListScreen')
      }
      else{
        alert(data?.message)
      }
    }

    // states for setting vales and verifying values
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState();
  const [emailColor, setEmailColor] = useState('#F5F9FE');
  const [password, setPassword] = useState();
  const [passwordColor, setPasswordColor] = useState('#F5F9FE');
  const [hide,setHide] = useState(true)
  const [passwordCheck,setPasswordCheck] = useState(false)
  const [emailCheck,setEmailCheck] = useState(false)

  return (
    <>
      {uri !== "" ? (
        <View style={{ flex: 1 }}>
          <WebView
            userAgent={
              Platform.OS === "android"
                ? "Chrome/110.0.5481.178 Mobile Safari/535.19"
                : "AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75"
            }
            source={{ uri }}
          />
        </View>
      ) : (
    <ScrollView style={styles.container}>
    <View style={{flexDirection:'row',justifyContent:'center',marginTop:'16%'}}>
        <Image
          source={require("../../assets/images/213.png")}
          style={{
            width: '50%',
            height: 80,
            backgroundColor: "transparent",
            left:15
          }}
          resizeMode="contain"
        />
      </View>
      <View style={{alignItems:'center',justifyContent:'center',marginTop:'10%'}}>
        <Text style={styles.text}>Sign Up</Text>
        <Text style={styles.textDes}>
          We find interesting articles for you.{"\n"}
          Let the knowledge come to you :)
        </Text>
      </View>
      
      <View style={styles.btnscontainer2}>
        <TouchableOpacity style={styles.button}
          onPress={()=>{alert('not supported on android')}}
        >
          <Image
            source={require("../../assets/images/AppleLogo.png")}
            style={{
              width: 12,
              height: 12,
              bottom:'1%'
            }}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
          onPress={()=>{openUrl(`https://lime-charming-horse.cyclic.app/auth/google`)}}
        >
          <Image
            source={require("../../assets/images/Google.png")}
            style={{
              width: 24,
              height: 24,
            }}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Google</Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center',marginBottom:'6%',marginHorizontal:'5.5%'}}>
        <View style={styles.lineStyle} />
          <View>
            <Text style={styles.pdetailTitle}>Or</Text>
          </View>
        <View style={styles.lineStyle} />
      </View>
      
      <SafeAreaView>
        <View style={{marginHorizontal:5}}>
          <TextInput style={{...styles.input,borderColor:emailColor}} placeholder="Email" 
            placeholderTextColor={'#7C8BA0'}
            onFocus={()=>setEmailColor(colors.baumBlue)}
            onBlur={()=>setEmailColor('#F5F9FE')}
            value={email}
            onChangeText={(t)=>setEmail(t)}
          />
        </View>
        <View  style={{flexDirection:'row',alignItems:'center',marginHorizontal:5}}>
          <TextInput style={{...styles.input,borderColor:passwordColor}} placeholder="Password" secureTextEntry={hide} 
            placeholderTextColor={'#7C8BA0'}
            onFocus={()=>setPasswordColor(colors.baumBlue)}
            onBlur={()=>setPasswordColor('#F5F9FE')}
            value={password}
            onChangeText={(t)=>setPassword(t)}
          />
          <View style={{right:50}}>
            <Icon name="eye-off-outline" color={hide?'#7C8BA0':colors.black} size={25} 
              onPress={()=>setHide(!hide)}
            />
         </View>
        </View>
{ passwordCheck?(
        <Text style={styles.passwordMatch}>
        Password should be longer than eight characters
        </Text>): emailCheck ?(
        <Text style={styles.passwordMatch}>
        Email format is incorrect
        </Text>):
        null
        }
      </SafeAreaView>
      <View style={{alignItems:'center',marginTop:'2%'}}>
        <TouchableOpacity style={styles.button2}
          onPress={UserRegisteration}
        >
          <Text style={styles.text2}>Create Account</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginHorizontal:'8%',marginVertical:'1%',marginBottom:'12%'}}>
        <Text style={styles.Haveaccount}>
          Do you have an account?{" "}
          <Text style={{ color: colors.buttons }}
            onPress={()=>navigation.navigate('SignIn')}
          >Sign In</Text>
        </Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <InformationModal openSetState={setModalVisible} title={'Email Confirmation'} 
          info={`We have sent an email to ${email} to confirm your email address`}
          navigation={navigation} navName={null}
        />    
      </Modal>
    </ScrollView>
)}
</>
  );
}
const styles = StyleSheet.create({
    loader: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      paddingTop: 30,
      backgroundColor: '#ecf0f1',
      padding: 8,
    },
    container: {
      flex:1,
      backgroundColor: colors.cardbackground
    },
    textInputC: {
      marginTop:100
    },    
    btnscontainer2: {
      width:SCREEN_WIDTH*.98,
      flexDirection: "row",
      justifyContent:'space-evenly',
      marginTop:'12%',
      marginBottom:'8%',
      marginLeft:'2%'
    },
    button: {
      backgroundColor: colors.inputField,
      width:SCREEN_WIDTH*.42,
      padding:16,
      borderRadius:14,
      flexDirection:'row',
      alignItems:'center',
    },
    buttonText: {
      color: colors.softBack,
      fontSize: 16,
      fontWeight:'500',
      left:'40%'
    },
    text: {
      color: colors.baumBlue,
      fontSize: 20,
      fontWeight:'600'
    },
    textDes: {
      marginTop:16,
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 22,
      color:colors.grey7
    },
    colum: {
      width: 50,
      height: 50,
    },
    input: {
      margin: 10,
      borderWidth: 1,
      padding: 10,
      width: SCREEN_WIDTH*.92,
      height: 60,
      backgroundColor: colors.inputField,
      borderWidth: 1,
      borderRadius: 14,
      marginTop:5,
      fontSize:16,
      fontWeight:'400',
      lineHeight:24,
      color:'#262626',
      paddingLeft:24
    },
    createaccountbtn: {
      background: colors.baumBlue,
      borderRadius: 14,
      width: 50,
      height: 100,
    },
    button2: {
      backgroundColor:colors.baumBlue,
      padding: 10,
      width: SCREEN_WIDTH*.92,
      height: 60,
      borderRadius: 14,
      justifyContent:'center',
      alignItems:'center',
      marginTop:'6%',
      marginBottom:'3%',
      shadowColor: colors.baumBlue,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 10,  
      elevation: 20,
    },
    text2: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
      color:colors.cardbackground
    },
    Newcontainer: {
      flex: 1,
    },
    Haveaccount:{
        fontWeight:'400',
        fontSize: 14,
        lineHeight: 22,
        color: "#3B4054",
    },
    passwordMatch:{
        fontSize: 12,
        lineHeight: 14.52,
        color: "#F30F0F",
        marginLeft:20
    },
    lineStyle:{
      flex: 1, 
      height: 1, 
      backgroundColor: '#F2F2F2'
    },
    pdetailTitle:{
      textAlign: 'center',
      fontSize:14,
      fontWeight:'400',
      color:colors.grey2,
      marginHorizontal:6
    },
  });
