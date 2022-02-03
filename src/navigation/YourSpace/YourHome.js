import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Playlist from './Tabs/Playlist';
import Album from './Tabs/Album';
import Artist from './Tabs/Artist';
import theme from '../../theme/theme';

const Tab = createMaterialTopTabNavigator()

export default function YourHome() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: theme.bg,
                },
                tabBarLabelStyle: {
                    color: theme.txt
                },
                tabBarIndicatorStyle: {
                    backgroundColor: theme.brand
                }
            }}
        >
            <Tab.Screen name="Playlist" component={Playlist} />
            <Tab.Screen name="Album" component={Album} />
            <Tab.Screen name="Artist" component={Artist} />
        </Tab.Navigator >
    )
}
