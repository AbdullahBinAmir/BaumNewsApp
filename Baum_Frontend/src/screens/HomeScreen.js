import { StyleSheet, View, ActivityIndicator, PanResponder, Alert, BackHandler,Modal } from 'react-native'
import React,{useState,useEffect, useContext, useRef} from 'react'
import { colors } from '../global/Color'
import { globalAPI } from '../global/globalAPI_URI'
import GetArticleContent from '../components/GetArticleContent'
import { FlatList } from 'react-native-gesture-handler'
import { store } from '../../Store'
import { logEvent } from '@amplitude/analytics-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import InformationModal from '../components/InformationModal'

const HomeScreen = ({navigation}) => {

  // state for loading AND setting articles data
  const [articlesData,setArticlesData] = useState([])
  const [isLoading,setIsLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false);
  const globalState = useContext(store);
  const { dispatch } = globalState;

  // calling events when screen is 75% viewable 
  const viewabilityConfig = {
      itemVisiblePercentThreshold: 75,
  }

  // on change of every article
  const handleOnViewableItemsChange = React.useCallback(({viewableItems, changed})=>{
    //console.log(viewableItems[0])
    if (viewableItems && viewableItems.length !== 0) {
      // setting current article url
      dispatch ({type:'UPDATE_URL',payload:viewableItems[0].item.url})
      // saving analytics using amplitude
      logEvent('Article Viewed', { article_id: viewableItems[0].item.id });
      //console.log('URL-Added',viewableItems[0].item.url)
    }
  },[])

  // recommending articles when user is at the end of reading current articles
  const onEndReached = () => {
    const ItemId = articlesData[articlesData.length - 1].id;
    // Fetch more data and append it to the current data state
    setIsLoading(true)
      try{
        fetch(`${globalAPI}getrecommendations?id=${ItemId}`)
        .then((response) => response.json())
        .then((responseJson) => {
          setIsLoading(false);
          //setArticlesData([...articlesData,...responseJson]);
          setArticlesData(responseJson);
        })
        .catch((error) => {
          alert(error);
        });
      }
      catch(error){
        alert('Sorry!' + error )
      }
  };

  // loading the latest articles 
  const handleLoad = async ()=>{
    const value=await AsyncStorage.getItem('is_viewed');
    console.log(value)
     value==='1'?setIsLoading(true):null
    try{
      fetch(`${globalAPI}getrecentarticles`)
      .then((response) => response.json())
      .then((responseJson) => {
        value==='1'?setIsLoading(false):null
        setArticlesData(responseJson);
      })
      .catch((error) => {
        alert(error);
      });
    }
    catch(error){
      alert('Sorry!' + error )
    }
  }

  const handleTutorialModal=async ()=>{
    const value=await AsyncStorage.getItem('is_viewed');
    if(value!=='1'){
      setModalVisible(true)
      await AsyncStorage.setItem('is_viewed','1');
    }
  }

  // on load loading the latest articles by calling handleLoad()
  useEffect(()=>{
    handleTutorialModal()
    handleLoad()
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to close app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  },[])

  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handlePanResponderMove = (event, gestureState) => {
    if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
      // User is swiping horizontally, enable FlatList scrolling
      setScrollEnabled(true);
    } else {
      // User is swiping vertically, disable FlatList scrolling
      setScrollEnabled(false);
      
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: handlePanResponderMove,
    })
  ).current;


  if ( isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator visible={true} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
        <InformationModal openSetState={setModalVisible} title={'How this works :)'} 
          info={` 1. Swipe left to go to the next article \n 2. Swipe right to go to the previous article \n 3. Scroll down to read the article \n`}
          navName={'HomeBottomNav'} setIsLoading={setIsLoading}
        />    
        </Modal>
      </View>
    );
  }
  return (
    <View style={styles.container}>
        <FlatList
          style={{marginTop: 10}}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={scrollEnabled} 
          {...panResponder.panHandlers}
          data={articlesData}
          keyExtractor={(item, index) => item.id.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={handleOnViewableItemsChange}
          renderItem={({item}) => (
                <GetArticleContent url={item.url} navigation={navigation} />
          )}
        />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  container:{
    flex:1,
    backgroundColor:colors.cardbackground,
  },
})