import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Player from './player/index'
import HomeScreenStack from './navigation/HomeScreenStack';
import theme from './theme/theme';
import { StatusBar, View } from 'react-native';
import TrackPlayer, { Capability } from 'react-native-track-player';
import SearchScreenStack from './navigation/SearchScreenStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlayerUI from './navigation/PlayerUI';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator()

const TabBarComponent = props => <BottomTabBar {...props} />;
const customTabComponent = (props) => (
  <View style={{backgroundColor: theme.bg}}>
    <Player />
    <TabBarComponent {...props} />
  </View>
)

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions} tabBar={customTabComponent}>
      <Tab.Screen name="Home" component={HomeScreenStack} />
      <Tab.Screen name="Search" component={SearchScreenStack} />
    </Tab.Navigator>
  )
}

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="HomeStack" headerMode="none" transitionerStyle={{backgroundColor: theme.bg}} screenOptions={{
      headerShown: false,
      headerTransparent: true
    }}>
      <Stack.Group>
        <Stack.Screen  name="HomeStack" component={TabNavigation} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="PlayerUI" component={PlayerUI} />
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

  return (
    <View style={{backgroundColor: theme.bg, flex: 1}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={{ backgroundColor: theme.bg, flex: 1 }}>
        <NavigationContainer style={{backgroundColor: theme.bg}} transitionerStyle={{backgroundColor: theme.bg}} >
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
  },
  tabBarActiveTintColor: theme.txt,
  tabBarInactiveTintColor: theme.gray,
  headerShown: false,
  tabBarStyle: {
    padding: 2,
    height: 55,
    paddingBottom: 5,
    backgroundColor: theme.sy,
    fontWeight: '700',
    borderTopColor: theme.sy
  }
})


export default App;
