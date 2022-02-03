import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { FlatList, StyleSheet, Text, TouchableHighlight, TouchableNativeFeedback, View } from 'react-native'
import { useMMKVStorage } from 'react-native-mmkv-storage'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import theme from '../../../theme/theme'
import { MMKV } from '../../../storage/index'
import FastImage from 'react-native-fast-image'
import APrenderer from '../../../components/Helpers/APrenderer'
import LinearGradient from 'react-native-linear-gradient'

export default function Playlist() {

    const navigation = useNavigation();
    const [playlist,] = useMMKVStorage('playlist', MMKV, [])

    const handleNavigation = (item, isoffline = false) => {

        if (!item && isoffline) {
            item = {}
            item.name = 'Offline Playlist'
            item.id = 'offline'
            item.subtitle = [{ text: 'Your offline songs' }]
            item.color = theme.brand
        }
        else if (!item) {
            item = {}
            item.name = 'Liked'
            item.id = 'likes'
            item.subtitle = [{ text: 'Your liked songs' }]
            item.color = '#4117b7'
        }

        navigation.navigate('YourAlbum', {
            title: item.name,
            obj: {
                type: 'YourAlbum',
                name: item.name,
                id: item.id,
                subtitle: item?.subtitle ? item.subtitle : [{ text: 'Your playlist' }],
                color: item.color,
            }
        })
    }

    const renderItem = ({ item }) => {
        return item ? (
            item?.browseId ?
                <APrenderer item={item} from="playlist" navigation={navigation} />
                : (
                    <TouchableNativeFeedback onPress={() => handleNavigation(item)}>
                        <View style={{ paddingHorizontal: 15, flex: 1, flexDirection: 'row', paddingVertical: 8 }}>
                            <LinearGradient
                                colors={[item.color, theme.sy]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={Styles.createPlaylist}>
                                <Text style={{ color: theme.txt, fontSize: 30, textTransform: 'uppercase' }}>{item.name[0]}</Text>

                            </LinearGradient>

                            <View style={{ paddingLeft: 15, justifyContent: 'center' }}>
                                <Text style={{ color: theme.txt, fontSize: 18 }}>{item.name}</Text>
                                <Text style={{ color: theme.txtSy, }}>Playlist</Text>

                            </View>
                        </View>
                    </TouchableNativeFeedback>
                )
        ) : null
    }

    const headerComponent = () => {
        return (
            <>
                <TouchableHighlight onPress={() => navigation.navigate('cp')}>
                    <View style={{ padding: 15, flex: 1, flexDirection: 'row', paddingBottom: 8 }}>
                        <View style={Styles.createPlaylist}>
                            <AntDesign color={theme.txtSy} name="plus" size={25} />
                        </View>
                        <View style={{ paddingLeft: 15, justifyContent: 'center' }}>
                            <Text style={{ color: theme.txt, fontSize: 18 }}>Create playlist</Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => handleNavigation(false)}>
                    <View style={{ paddingHorizontal: 15, flex: 1, flexDirection: 'row', paddingVertical: 8 }}>
                        <LinearGradient
                            colors={['#4117b7', theme.sy]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} style={Styles.createPlaylist}>
                            <AntDesign name="heart" color={theme.textLight} size={23} />
                        </LinearGradient>
                        <View style={{ paddingLeft: 15, justifyContent: 'center' }}>
                            <Text style={{ color: theme.txt, fontSize: 18 }}>Liked songs</Text>
                            <Text style={{ color: theme.txtSy }}>Playlist</Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => handleNavigation(false, true)}>
                    <View style={{ paddingHorizontal: 15, flex: 1, flexDirection: 'row', paddingVertical: 8 }}>
                        <LinearGradient
                            colors={[theme.brand, theme.sy]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} style={Styles.createPlaylist}>
                            <Ionicons name="download-outline" color={theme.textLight} size={25} />
                        </LinearGradient>
                        <View style={{ paddingLeft: 15, justifyContent: 'center' }}>
                            <Text style={{ color: theme.txt, fontSize: 18 }}>Offline songs</Text>
                            <Text style={{ color: theme.txtSy }}>Playlist</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </>
        )
    }

    return (
        playlist && (
            <FlatList
                data={playlist}
                ListHeaderComponent={headerComponent}
                renderItem={renderItem}
            />
        )
    )
}

const Styles = StyleSheet.create({
    createPlaylist: {
        width: 65,
        height: 65,
        backgroundColor: theme.syGray,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    }
})
