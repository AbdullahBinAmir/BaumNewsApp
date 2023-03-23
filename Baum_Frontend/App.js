import { StyleSheet, View, StatusBar } from 'react-native'
import React from 'react'
import { colors } from './src/global/Color'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import HomeBottomNav from './src/navigation/HomeBottomNav';
import SignIn from './src/screens/LoginScreen';
import SignUp from './src/screens/SignupScreen';
import IntersestListScreen from './src/screens/IntersestListScreen';
import ForgotPassword from './src/screens/ForgotPasswordScreen';
import EnterCodeScreen from './src/screens/EnterCodeScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import linking from './src/global/Config';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <View style={{flex:1}}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cardbackground} />
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="IntersestListScreen"
            component={IntersestListScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HomeBottomNav"
            component={HomeBottomNav}
            options={{headerShown: false}}
          />
          <Stack.Group>
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EnterCodeScreen"
              component={EnterCodeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
              options={{headerShown: false}}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  )
}

export default App