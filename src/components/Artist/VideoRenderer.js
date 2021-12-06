import React from 'react'
import FastImage from 'react-native-fast-image'
import { useDispatch } from 'react-redux'
import theme from '../../theme/theme'
import { getPlaylistThunk, setPlayList, updatePlayer } from '../../store/features/playerSlice'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { PlaySong } from '../../utils/play'
import { useNavigation, useRoute } from '@react-navigation/core'
import { StackActions } from '@react-navigation/native';

const styles = StyleSheet.create({
    item: {
        marginRight: 20,
    },
    itemText: {
        color: theme.txt,
        fontSize: 16,
        marginTop: 5,
    },
    subtitle: {
        flexDirection: 'row',
        color: theme.txtSy
    }
})

export default function VideoRenderer({ album, imageStyle, width }) {

    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { name } = useRoute();

    const handlePress = async (params) => {
        const videoId = params?.watchEndpoint?.videoId
        const playlistId = params?.watchEndpoint?.playlistId

        if (videoId && !playlistId) {

            dispatch(updatePlayer({
                show: true,
                isLoading: true
            }))

            await PlaySong(0, videoId, params.thumbnail)

            return
        }

        if (videoId && playlistId) {

            dispatch(updatePlayer({
                show: true,
                isLoading: true
            }))

            await PlaySong(0, videoId, params.thumbnail, playlistId)

            const { playlist: cPlaylist } = await getPlaylistThunk({ videoId, playlistId })

            dispatch(setPlayList({
                playlist: cPlaylist,
            }))

            return
        }


        if (params.type === 'MUSIC_PAGE_TYPE_ARTIST') {

            const pushAction = StackActions.push('Artist', {
                browseId: params.endpoints,
            })

            navigation.dispatch(pushAction);

            return
        }

        console.log(name)

        if (params.type === 'MUSIC_PAGE_TYPE_PLAYLIST') {

            let obj = {}
            obj.browseId = params.browseId
            obj.thumbnails = params.thumbnail
            obj.subtitle = params.subtitle
            obj.playlistId = params.browseId
            obj.type = 'playlist'
            const route = name === 'MainHome' ? 'HomeAlbum' : 'SearchAlbum'

            navigation.navigate(route,
                {
                    title: params.title,
                    obj,
                })

            return
        }

        if ('endpoints' in params) {
            let obj = {}
            obj.browseId = params.endpoints
            obj.thumbnails = params.thumbnail
            obj.subtitle = params.subtitle
            obj.playlistId = params.endpoints
            obj.type = params.type === 'MUSIC_PAGE_TYPE_ALBUM' ? 'Album' : 'playlist'
            const route = name === 'MainHome' ? 'HomeAlbum' : 'SearchAlbum'

            navigation.navigate(route,
                {
                    title: params.title,
                    obj,
                })
        }
    }

    return album && album?.subtitle?.length ? (
        <TouchableOpacity onPress={() => handlePress(album)}>
            <View style={[styles.item, { width }]}>
                <FastImage source={{ uri: album?.thumbnail }} style={imageStyle} />
                <Text numberOfLines={2} style={styles.itemText}>{album?.title}</Text>
                <Text numberOfLines={1} style={styles?.subtitle}>
                    {album?.subtitle?.map((st, i) => (
                        <Text key={`subtitle_T_ALBuM${i}`}>{st?.text}</Text>
                    ))}
                </Text>
            </View>
        </TouchableOpacity>

    ) : null
}
