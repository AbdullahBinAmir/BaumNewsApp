import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../global/Color'
import { Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Fontisto'
import { Pressable } from 'react-native'
import { globalAPI } from '../global/globalAPI_URI'

const  SCREEN_WIDTH = Dimensions.get('window').width

const SettingsModal = ({openSetState,title}) => {
    const [message,setMessage] = useState('')

    console.log(globalThis.userData)

    const sendMessage = ()=>{
        const data=JSON.stringify({
            uid: globalThis.userData?._id,
            message: message
          })
        fetch(`${globalAPI}${title=='Send Feedback'?'customerfeedback':'customersupport'}`, {
            method: 'POST',
            headers: {
              'Accept':'application/json',
              'Content-Type': 'application/json'
            },
            body:data
          })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if(responseJson.userId===globalThis.userData._id)
                alert('Your response has been sent...')
                else{
                    alert('Please try again later!')
                }
                openSetState(false)
            })
            .catch((error) => {
              alert(error);
            });
    }
    
  return (
    <View style={styles.container}>
      <View style={styles.alertView}>
        <View style={styles.alertTitleView}>
            <Text style={styles.alertTitle}>{title}</Text>
            <Icon 
              name='close-a'
              size={16}
              color={colors.grey3}
              style={{right:25}}
              onPress={()=>openSetState(false)}
            />
        </View>
        <View style={styles.infoView}>
            <TextInput
                placeholder='Write Your Message..'
                multiline={true}
                value={message}
                onChangeText={(t)=>setMessage(t)}
            />
        </View>
        <Pressable style={styles.submitBtn} onPress={sendMessage}>
            <Text style={styles.btnText}>Confirm</Text>
        </Pressable>
        <Pressable style={{...styles.submitBtn,backgroundColor:colors.cardbackground,borderWidth:1,borderColor:colors.grey2}}
         onPress={()=>openSetState(false)}
        >
            <Text style={{...styles.btnText,color:colors.grey2}}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default SettingsModal

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'rgba(250, 250, 250, 0.25)',
        justifyContent:'center',
        alignItems:'center'
    },
    alertView:{
        backgroundColor:colors.cardbackground,
        width:SCREEN_WIDTH*.95,
        margin:10,
        paddingHorizontal:10,
        paddingVertical:15,
        borderWidth:1,
        borderColor:colors.grey2,
        borderRadius:12
    },
    alertTitleView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    alertTitle:{
        fontSize:18,
        color:colors.softBack,
        fontWeight:'600',
        left:10
    },
    infoView:{
        marginVertical:8,
        borderWidth:1,
        borderColor:colors.softBack,
        marginHorizontal:10,
        marginTop:12,
        borderRadius:12,
        height:150
    },
    infoText:{
        fontSize:14,
        fontWeight:'400',
        color:colors.softBack
    },
    submitBtn:{
        backgroundColor:colors.softBack,
        marginHorizontal:10,
        marginVertical:5,
        padding:10,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:8
    },
    btnText:{
        fontSize:16,
        fontWeight:'600',
        color:colors.cardbackground
    }
})