import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../global/Color';
import HomeScreen from '../screens/HomeScreen';
import SettingScreen from '../screens/SettingScreen';
import ShareButton from '../components/ShareButton';
import { Image } from '@rneui/base';

const bottomTab = createBottomTabNavigator();

const HomeBottomNav = () => {
  return (
    <bottomTab.Navigator 
    screenOptions={{
        tabBarActiveTintColor:colors.softBack,
        tabBarInactiveTintColor:'#ABABAB',
        tabBarShowLabel:false,
    }}
>
    <bottomTab.Screen name="Home" component={HomeScreen}
            options={
                {
                    tabBarLabel:"Home",
                    tabBarIcon:({color,size})=>(
                        <Image
                            source={require('../../assets/images/home_icon.png')}
                            style={{width:17.75,height:17,opacity:color=='#ABABAB'?.4:1}}
                        />
                    ),
                    headerShown:false
                }
            }
    />
    <bottomTab.Screen name="Share" component={ShareButton}
            options={
                {
                    tabBarLabel:"Share",
                    tabBarIcon:({color,size})=>(
                        <Image
                            source={require('../../assets/images/share_ios.png')}
                            style={{width:17.75,height:17,opacity:color=='#ABABAB'?.4:1}}
                        />
                    ),
                    headerShown:false
                }
            }
    />
    <bottomTab.Screen name="Setting" component={SettingScreen}
            options={
                {
                    tabBarLabel:"Settings",
                    tabBarIcon:({color,size})=>(
                        <Image
                            source={require('../../assets/images/Setting_line.png')}
                            style={{width:17.75,height:17,opacity:color=='#ABABAB'?.4:1}}
                        />
                    ),
                    headerShown:false
                }
            }
        />
    </bottomTab.Navigator>
  )
}

export default HomeBottomNav;