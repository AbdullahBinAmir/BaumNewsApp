import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../global/Color'
import { Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Fontisto'
import { Pressable } from 'react-native'

const  SCREEN_WIDTH = Dimensions.get('window').width

const InformationModal = ({openSetState,title,info,navName,setIsLoading}) => {
  return (
    <View style={navName?{...styles.container,backgroundColor:colors.nonSelected}:styles.container}>
      <View style={styles.alertView}>
        <View style={styles.alertTitleView}>
            <Text style={styles.alertTitle}>{title}</Text>
            <Icon 
              name='close-a'
              size={20}
              color={'#ABABAB'}
              style={{right:"30%"}}
              onPress={()=>openSetState(false)}
            />
        </View>
        <View style={styles.infoView}>
            <Text style={styles.infoText} >{info}</Text>
        </View>
        <Pressable style={styles.submitBtn}
            onPress={()=>{
                setIsLoading?setIsLoading(false):null
                openSetState(false)
            }}
        >
            <Text style={styles.btnText}>I got it!</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default InformationModal

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
        margin:'5%',
        padding:'6%',
        borderWidth:1,
        borderColor:colors.grey5,
        borderRadius:12
    },
    alertTitleView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginLeft:'2%'
    },
    alertTitle:{
        fontSize:18,
        color:colors.softBack,
        fontWeight:'600'
    },
    infoView:{
        left:'2%'
    },
    infoText:{
        fontSize:14,
        fontWeight:'400',
        color:colors.softBack,
        lineHeight:25,
        marginTop:'1%',
    },
    submitBtn:{
        width:'100%',
        backgroundColor:colors.baumBlue,
        marginHorizontal:'.2%',
        marginVertical:'1%',
        padding:'5%',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    btnText:{
        fontSize:16,
        fontWeight:'600',
        color:colors.cardbackground
    }
})