import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../global/Color'
import { Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Fontisto'
import { Pressable } from 'react-native'
import { globalAPI } from '../global/globalAPI_URI'

const  SCREEN_WIDTH = Dimensions.get('window').width

const DeleteAccountModal = ({openSetState,navigation}) => {

  //console.log(globalThis.userData)

  // calling api to delete a user
  const deleteUser = ()=>{
      fetch(`${globalAPI}deleteuser?uid=${globalThis.userData?._id}`, {
          method: 'DELETE',
        })
          .then((response) => response.json())
          .then((responseJson) => {
              alert(responseJson?.message)
              openSetState(false)
              navigation.replace('SignIn')
          })
          .catch((error) => {
            alert(error);
          });
  }

  return (
    <View style={styles.container}>
      <View style={styles.alertView}>
        <View style={styles.alertTitleView}>
            <Text style={styles.alertTitle}>Are you sure? Your data will be deleted forever.</Text>
            <Icon 
              name='close-a'
              size={18}
              color={colors.grey3}
              style={{right:25,bottom:10}}
              onPress={()=>openSetState(false)}
            />
        </View>
        <Pressable style={styles.submitBtn} onPress={deleteUser}>
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

export default DeleteAccountModal

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
        borderColor:colors.softBack,
        borderRadius:12
    },
    alertTitleView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:15
    },
    alertTitle:{
        fontSize:18,
        color:colors.softBack,
        fontWeight:'600',
        width:SCREEN_WIDTH*.7
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