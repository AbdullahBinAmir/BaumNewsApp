import React,{useContext} from 'react';
import { View, Share } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { store } from '../../Store';
import { colors } from '../global/Color';
import { logEvent } from '@amplitude/analytics-react-native';

const ShareButton = ({navigation}) => {

  const globalState = useContext(store);
  console.log('state url',globalState.state.url)

  React.useEffect(() => {//params wal chkr
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      console.log('In useEffect',globalState.state.url)
      handleShare(globalState.state.url)
    });

    return unsubscribe;
  }, [navigation,globalState.state.url]);

  const handleShare = async (url) => {
    try {
      const result = await Share.share({
        message: url,
      });
      if (result.action === Share.sharedAction) {
        console.log('Link shared successfully');
        logEvent('Article Shared', { article_url: globalState.state.url });
        navigation.navigate('Home')
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return(
    <View style={{flex:1,backgroundColor:colors.cardbackground,alignItems:'center',justifyContent:'center'}}>
      <ActivityIndicator
        color={colors.buttons}
        size={40}
      />
    </View>
  )

};

export default ShareButton;