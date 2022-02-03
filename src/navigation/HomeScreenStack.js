import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AlbumScreen from './AlbumScreen';
import Home from './Home/index';
import { StatusBar } from 'react-native';
import theme from '../theme/theme';
import ArtistScreen from './ArtistScreen';
import Like from '../components/Helpers/Like';

const Stack = createNativeStackNavigator();

export default function HomeScreenStack() {

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="rgba(0,0,0,0.4)"
                barStyle="light-content"
            />
            <Stack.Navigator>
                <Stack.Screen options={{
                    headerShown: false,
                    headerTransparent: true,
                }}
                    name="MainHome" component={Home} />

                <Stack.Screen options={({ route }) => ({
                    title: route.params.title,
                    headerStyle: {
                        backgroundColor: theme.sy,
                    },
                    headerTintColor: theme.txt,
                    headerRight: () => <Like route={route} />
                })}
                    name="HomeAlbum" component={AlbumScreen} />

                <Stack.Screen options={{
                    headerShown: true,
                    headerShadowVisible: false,
                    headerTintColor: theme.txt,
                    title: ''
                }}
                    name="Artist"
                    component={ArtistScreen} />

                <Stack.Screen options={({ route }) => ({
                    title: route.params.title,
                    headerStyle: {
                        backgroundColor: theme.sy,
                    },
                    headerTintColor: theme.txt
                })}
                    name="YourAlbum" component={AlbumScreen} />

            </Stack.Navigator>
        </>
    )
}
