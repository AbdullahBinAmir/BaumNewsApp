import { Dimensions, FlatList, Pressable, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Interests } from '../global/InterestList'
import { colors } from '../global/Color'
import Icon from 'react-native-vector-icons/AntDesign'

const  SCREEN_WIDTH = Dimensions.get('window').width

// signle interest item code
const InterestBox = ({item, changeCount, count})=>{
    const [selected,setSelected] = React.useState(false)
    return(
        <TouchableOpacity
            onPress={()=>{
                if(selected){
                    changeCount(--count)
                }
                else{
                    changeCount(++count)
                }
                setSelected(!selected)
            }}
        >
            <View style={selected?{...styles.listView,backgroundColor:colors.baumBlue}:styles.listView}>
                <Image 
                    source={item.image}
                    style={styles.listImage}
                />
                <Text style={selected?{...styles.listText,color:colors.cardbackground}:styles.listText}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )
}

// getting intrests list and loading in the list
const IntersestListScreen = ({navigation}) => {
    const [count,setCount] = useState(0)
  return (
    <View style={styles.container}>
        <Pressable style={{marginHorizontal:12,marginVertical:18}}
            onPress={()=>navigation.goBack()}
        >
            <Icon 
                name='arrowleft'
                size={24}
                color={colors.softBack}
            />
        </Pressable>
        <View style={styles.titleView}>
            <Text style={styles.titleText}>Your Interests</Text>
        </View>
        <Text style={styles.primaryText}>Please provide at least one interest so we can provide customized feed just for you</Text>
        <View style={{flex: 1,flexGrow:1}}>
            <FlatList
            style={{marginTop: 20,marginBottom:10}}
            horizontal={false}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            data={Interests}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
                <InterestBox item={item} changeCount={setCount} count={count} />
            )}
            />
        </View>  
        <Pressable style={count!==0?styles.submitBtn:{...styles.submitBtn,backgroundColor:'#E1E1E1'}}
            onPress={()=>{
                count>0?navigation.navigate('HomeBottomNav'):
                alert('Please select atleast one interest...')
            }}
        >
            <Text style={styles.submitText}>Done</Text>
        </Pressable>
    </View>
  )
}

export default IntersestListScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.cardbackground
    },
    titleView:{
        marginHorizontal:12,
        width:SCREEN_WIDTH
    },
    titleText:{
        color:colors.baumBlue,
        fontSize:24,
        fontWeight:'600'
    },
    primaryText:{
        width:SCREEN_WIDTH*.9,
        alignSelf:'center',
        fontSize:16,
        fontWeight:'400',
        color:colors.softBack,
        marginTop:16
    },
    listView:{
        flexDirection:'row',
        width:SCREEN_WIDTH*.45,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:colors.grey4,
        marginLeft:10,
        marginVertical:8,
        paddingVertical:8,
        borderRadius:12
    },
    listImage:{
        height:18,
        width:18,
        right:2
    },
    listText:{
        fontSize:16,
        color:colors.grey2,
        fontWeight:'400',
        marginLeft:2
    },
    submitBtn:{

        width:SCREEN_WIDTH*.96,
        paddingHorizontal:'5%',
        paddingVertical:'4.6%',
        marginVertical:'4%',
        left:'1.8%',
        bottom:'.5%',
        backgroundColor:colors.baumBlue,
        borderRadius:15
    },
    submitText:{
        fontSize:16,
        color:colors.cardbackground,
        fontWeight:'500',
        textAlign:'center'
    }
})