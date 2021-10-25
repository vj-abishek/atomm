import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Player from './player/index'
import SearchScreen from './navigation/SearchScreen';
import HomeScreenStack from './navigation/HomeScreenStack';
import theme from './theme/theme';
import { StatusBar,  View } from 'react-native';
import TrackPlayer, { Capability } from 'react-native-track-player';

const Tab = createBottomTabNavigator();

const TabBarComponent = props => <BottomTabBar {...props} />;
const customTabComponent = (props) => (
  <View>
    <Player/>
    <TabBarComponent {...props} />
  </View>
)

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
    <>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
          />
          <View style={{backgroundColor: theme.bg, flex: 1}}>
            <NavigationContainer>
              <Tab.Navigator screenOptions={screenOptions} tabBar={customTabComponent}>
                <Tab.Screen name="Home" component={HomeScreenStack} />
                <Tab.Screen name="Search" component={SearchScreen} />
              </Tab.Navigator>
          </NavigationContainer>
          </View>

    </>
  );
};

const screenOptions = ({ route }) => ({
  tabBarIcon: ({focused,  color, size }) => {

    if (route.name === 'Home') {
      const iconName = focused ? 'home-variant': 'home-variant-outline';
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
    borderTopColor: '#605F60'
  }
})


export default App;
