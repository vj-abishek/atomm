import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { StatusBar } from 'react-native'
import Like from '../../components/Helpers/Like';
import Settings from '../../components/Helpers/Settings';
import SettingsComponent from './Tabs/Settings'
import theme from '../../theme/theme';
import AlbumScreen from '../AlbumScreen';
import YourHome from './YourHome';

const Stack = createNativeStackNavigator();

export default function index() {
    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <Stack.Navigator>
                <Stack.Screen name="YourSpace" options={{
                    headerTitleStyle: {
                        fontSize: 28,
                        fontWeight: 'bold'
                    },
                    headerTitle: 'Your Space',
                    headerStyle: {
                        backgroundColor: theme.bg
                    },
                    headerTintColor: theme.txt,
                    headerShadowVisible: false,
                    headerRight: () => <Settings />
                }} component={YourHome} />

                <Stack.Screen options={({ route }) => ({
                    title: route.params.title,
                    headerStyle: {
                        backgroundColor: theme.sy,
                    },
                    headerTintColor: theme.txt,
                    headerRight: () => <Like route={route} />
                })}
                    name="YourAlbum" component={AlbumScreen} />

                <Stack.Screen options={({ route }) => ({
                    title: 'Settings',
                    headerStyle: {
                        backgroundColor: theme.sy,
                    },
                    headerTintColor: theme.txt,
                })}

                    name="Settings" component={SettingsComponent}
                />
            </Stack.Navigator>
        </>
    )
}
