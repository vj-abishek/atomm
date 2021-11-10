import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import { StatusBar } from 'react-native'
import theme from '../theme/theme';
import AlbumScreen from './AlbumScreen';
import SearchScreen from './SearchScreen';

const Stack = createNativeStackNavigator();


export default function SearchScreenStack() {
    return (
        <>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
          />
        <Stack.Navigator>
                <Stack.Screen  options={{
                    headerShown: false,
                    headerTransparent: true
                }}
                 name="SearchHome" component={SearchScreen} />
                <Stack.Screen  options={({ route }) => ({
                    title: route.params.title,
                    headerStyle: {
                        backgroundColor: theme.sy,
                    },
                    headerTintColor: theme.txt
                })} name="SearchAlbum" component={AlbumScreen} />
        </Stack.Navigator>
        </>
    )
}