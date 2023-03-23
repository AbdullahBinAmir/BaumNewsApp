import { Dimensions, StyleSheet, Text, View, Pressable, Modal } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../global/Color'
import { Divider } from 'react-native-paper'
import SettingsModal from '../components/SettingModal'
import DeleteAccountModal from '../components/DeleteAccountModal'
import AsyncStorage from '@react-native-async-storage/async-storage'

SCREEN_WIDTH = Dimensions.get('window').width
SCREEN_HEIGHT = Dimensions.get('window').height

const SettingScreen = ({navigation}) => {

  // states to load modal/popus
  const [title,setTitle] = useState('')
  
  const [modalVisible, setModalVisible] = useState(false);
  const [delmodalVisible, setDelModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>For You</Text>
      </View>
      <Text style={styles.aboutTitleText}>About</Text>
      <Pressable style={styles.serviceView}
        onPress={()=>{
          setTitle('Contact Support')
          setModalVisible(true)
        }}
      >
        <Text style={styles.serviceTitle}>Contact Support</Text>
      </Pressable>
      <Divider/>
      <Pressable style={styles.serviceView}
        onPress={()=>{
          setTitle('Send Feedback')
          setModalVisible(true)
        }}
      >
        <Text style={styles.serviceTitle}>Send Feedback</Text>
      </Pressable>
      <Divider/>
      <View style={styles.serviceView}>
        <Text style={styles.serviceTitle}>Privacy Policy</Text>
      </View>
      <Divider/>
      <Text style={styles.aboutTitleText}>Account</Text>
      <Pressable style={styles.serviceView}
        onPress={async ()=>{
          await AsyncStorage.setItem('user_token','1');
          navigation.replace('SignIn')
        }}
      >
        <Text style={styles.serviceTitle}>Sign Out</Text>
      </Pressable>
      <Divider/>
      <Pressable style={styles.serviceView} onPress={()=>setDelModalVisible(true)}>
        <Text style={{...styles.serviceTitle,color:'#EA4335'}}>Delete Account</Text>
      </Pressable>
      <Divider/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <SettingsModal openSetState={setModalVisible} title={title} />    
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={delmodalVisible}
      >
        <DeleteAccountModal openSetState={setDelModalVisible} navigation={navigation} />    
      </Modal>
    </View>
  )
}

export default SettingScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:colors.cardbackground
  },
  headerView:{
    height:SCREEN_HEIGHT*.12,
    width:SCREEN_WIDTH,
    justifyContent:'center',
    paddingHorizontal:10
  },
  headerText:{
    color:colors.softBack,
    fontSize:26,
    fontWeight:'700',
    marginLeft:5
  },
  aboutTitleText:{
    fontSize:14,
    fontWeight:'700',
    color:'#ABABAB',
    backgroundColor:'#F2F2F2',
    paddingVertical:12,
    paddingHorizontal:15
  },
  serviceView:{
    width:SCREEN_WIDTH,
    paddingHorizontal:10,
    paddingVertical:15
  },
  serviceTitle:{
    color:colors.softBack,
    fontSize:16,
    fontWeight:'700',
    marginLeft:10
  }
})