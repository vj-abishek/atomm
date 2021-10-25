import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AlbumScreen from './AlbumScreen';
import HomeScreen from './HomeScreen';
import { StatusBar } from 'react-native';
import theme from '../theme/theme';

const Stack = createNativeStackNavigator();


export default function HomeScreenStack() {
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
                }}
                 name="MainHome" component={HomeScreen} />
             <Stack.Screen  options={({ route }) => ({
                  title: route.params.title,
                  headerStyle: {
                    backgroundColor: theme.sy,
                    },
                    headerTintColor: theme.txt
             })} name="Album" component={AlbumScreen} />
        </Stack.Navigator>
        </>
    )
}
