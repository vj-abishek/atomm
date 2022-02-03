import React from 'react'
import { View, Text, StatusBar, StyleSheet, TouchableHighlight, FlatList, ToastAndroid } from 'react-native'
import { Button } from 'react-native-elements'
import theme from '../../theme/theme'
import { useMMKVStorage } from 'react-native-mmkv-storage'
import { MMKV } from '../../storage/index'

export default function index({ route, navigation }) {

    const [playlist, setLocalData] = useMMKVStorage('playlist', MMKV, [])

    const handleAdd = (itm) => {
        const oldPlaylists = MMKV.getArray('newPlaylist');
        let bool = false

        const newPlaylist = oldPlaylists.map((playlist) => {
            if (playlist.id === itm.id) {
                const alreadyPresent = playlist.items.some((song) => song.videoId === route.params.list.videoId)

                if (alreadyPresent) {
                    ToastAndroid.show('Song already present in playlist', ToastAndroid.SHORT);
                    bool = true
                    navigation.pop(2)
                    return;
                }
                playlist?.items?.push(route?.params?.list)
                return playlist
            }
            return playlist
        })

        if (bool) return;

        MMKV.setArray('newPlaylist', newPlaylist)

        ToastAndroid.show('Added to playlist', ToastAndroid.SHORT)

        navigation.pop(2)
    }

    const headerComponent = () => (
        <View style={{ alignItems: 'center', justifyContent: 'center', height: 90 }}>
            <Button title="New Playlist"
                buttonStyle={{
                    backgroundColor: theme.brand,
                    height: 50
                }}
                containerStyle={{
                    borderRadius: 50,
                    width: 180,
                }}

                titleStyle={{
                    fontSize: 18,
                    color: theme.txt,
                    fontWeight: 'bold'
                }}

                onPress={() => navigation.navigate('cp')}
            />
        </View>
    )

    const renderItem = ({ item }) => item?.name ? (
        <TouchableHighlight onPress={() => handleAdd(item)}>
            <View style={{ paddingHorizontal: 15, flex: 1, flexDirection: 'row', paddingVertical: 8 }}>
                <View style={[styles.createPlaylist, { backgroundColor: item?.color }]}>
                    <Text style={{ color: theme.txt, fontSize: 30, textTransform: 'uppercase' }}>{item?.name[0]}</Text>
                </View>
                <View style={{ paddingLeft: 15, justifyContent: 'center' }}>
                    <Text style={{ color: theme.txt, fontSize: 18 }}>{item.name}</Text>
                    <Text style={{ color: theme.txtSy, }}>Playlist</Text>

                </View>
            </View>
        </TouchableHighlight>
    ) : null

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <View style={styles.container}>

                {playlist && (
                    <FlatList
                        data={playlist}
                        ListHeaderComponent={headerComponent}
                        renderItem={renderItem}
                    />
                )}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    createPlaylist: {
        width: 65,
        height: 65,
        backgroundColor: theme.syGray,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    }
})
