import React, { useEffect } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Mt from 'react-native-vector-icons/MaterialIcons'
import Player from './player/index'
import { useDispatch, useSelector } from 'react-redux';
import { setFocusSearch, setSettings } from './store/features/playerSlice'
import HomeScreenStack from './navigation/HomeScreenStack';
import YourScreenStack from './navigation/YourSpace'
import CreatePlaylist from './components/Playlist/Create'
import theme from './theme/theme';
import { StatusBar, View } from 'react-native';
import TrackPlayer, { Capability } from 'react-native-track-player';
import SearchScreenStack from './navigation/SearchScreenStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlayerUI from './navigation/PlayerUI';
import Overlay from './navigation/Overlay'
import PlayListUI from './components/Playlist/index'
import AddToPlaylist from './navigation/AddToPlaylist'
import 'react-native-gesture-handler';
import Settings from './components/Helpers/Settings';
import { MMKV } from './storage';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator()

const myTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: theme.bg,
  },
}

const TabBarComponent = props => <BottomTabBar {...props} />;
const customTabComponent = (props) => (
  <>
    <Player />
    <TabBarComponent {...props} />
  </>
)

const TabNavigation = () => {
  const dispatch = useDispatch()
  const { focusSearch } = useSelector(state => state.player)

  const handlePress = () => {
    const { count } = focusSearch

    if (count >= 1) {
      dispatch(setFocusSearch({
        focusSearch: {
          isFocus: true,
          count: 0
        }
      }))
      return
    }

    dispatch(setFocusSearch({
      focusSearch: {
        iSFocus: false,
        count: 1
      }
    }))
  }


  return (
    <Tab.Navigator screenOptions={screenOptions} tabBar={customTabComponent}>
      <Tab.Screen name="Home" component={HomeScreenStack} />
      <Tab.Screen listeners={{
        tabPress: handlePress
      }} name="Search" component={SearchScreenStack} />
      <Tab.Screen name="More" component={YourScreenStack} />
    </Tab.Navigator>
  )
}

const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeStack"
      headerMode="none"
      transitionerStyle={{
        backgroundColor: theme.bg
      }}
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
      }}>
      <Stack.Group>
        <Stack.Screen name="HomeStack" component={TabNavigation} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="PlayerUI" component={PlayerUI} />
        <Stack.Screen name="Playlist" options={{
          title: 'Current Playlist',
          headerTintColor: theme.txt,
          headerStyle: {
            backgroundColor: theme.bg,
          },
          headerShown: true,
          headerTransparent: false
        }} component={PlayListUI} />
        <Stack.Screen name="cp" component={CreatePlaylist}
          options={{
            headerShown: false,
          }} />
        <Stack.Screen name="options" component={Overlay}
          options={{
            headerShown: false,
          }} />
        <Stack.Screen name="Add to Playlist" component={AddToPlaylist}
          options={{
            headerTitle: 'Add to Playlist',
            headerTintColor: theme.txt,
            headerStyle: {
              backgroundColor: theme.sy,
            },
            headerTitleAlign: 'center',
            headerShown: true,
            headerTransparent: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

const App = () => {

  const setUpTrackPlayer = async () => {
    try {
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack !== null) {
        await TrackPlayer.pause()
        return;
      }
      await TrackPlayer.setupPlayer({});
      TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SeekTo,
          Capability.SkipToNext,
          Capability.SkipToPrevious
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious
        ],
      })
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setUpTrackPlayer();
    return () => TrackPlayer.destroy();
  }, []);

  useEffect(() => {
    const settings = MMKV.getMap('setttings')

    if (settings) {
      dispatch(setSettings(settings))
    }
  }, [])

  return (
    <View style={{ backgroundColor: theme.bg, flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor="rgba(0,0,0,0.4)"
        barStyle="light-content"
      />
      <View style={{ backgroundColor: theme.bg, flex: 1 }}>
        <NavigationContainer theme={myTheme} style={{ backgroundColor: theme.bg }} transitionerStyle={{ backgroundColor: theme.bg }} >
          <StackNavigation />
        </NavigationContainer>
      </View>

    </View>
  );
};

const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {

    if (route.name === 'Home') {
      const iconName = focused ? 'home-variant' : 'home-variant-outline';
      return <MaterialIcons name={iconName} size={size} color={color} />
    }

    if (route.name === 'Search') {
      const iconName = focused ? 'search' : 'search-outline';
      return <Ionicons name={iconName} size={size} color={color} />
    }

    if (route.name === 'More') {
      const iconName = 'more-horiz';
      return <Mt name={iconName} size={size} color={color} />
    }
  },
  tabBarActiveTintColor: theme.txt,
  tabBarInactiveTintColor: theme.gray,
  tabBarHideOnKeyboard: true,
  headerShown: false,
  tabBarStyle: {
    padding: 2,
    height: 55,
    paddingBottom: 5,
    backgroundColor: theme.sy,
    fontWeight: '700',
    borderTopColor: theme.sy,
  }
})


export default App;
