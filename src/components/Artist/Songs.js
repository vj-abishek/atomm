import React from 'react'
import { View, Text, StyleSheet, TouchableNativeFeedback, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'
import { getPlaylistThunk, getQueue, setPlayList, updatePlayer } from '../../store/features/playerSlice'
import theme from '../../theme/theme'
import { PlaySong } from '../../utils/play'

export default function Songs({ data }) {

    const dispatch = useDispatch()
    const { playlist } = useSelector(state => state.player)

    const handlePress = async (params, i) => {
        const videoId = params?.watchEndpoint?.videoId
        const playlistId = params?.watchEndpoint?.playlistId
        const thumbnail = params?.thumbnail.replace('w120', 'w544').replace('h120', 'h544')

        if (videoId && !playlistId) {

            dispatch(updatePlayer({
                show: true,
                isLoading: true
            }))

            await PlaySong(i, videoId, thumbnail)

            return
        }

        if (videoId && playlistId) {

            dispatch(updatePlayer({
                show: true,
                isLoading: true
            }))

            await PlaySong(i, videoId, thumbnail, playlistId)

            const { playlist: cPlaylist } = await getPlaylistThunk({ videoId, playlistId })

            dispatch(setPlayList({
                playlist: cPlaylist,
            }))

            return
        }
    }

    const shufflePlay = async (songs) => {
        const { watchEndpoint: { videoId, playlistId } } = songs[0]

        if (videoId && playlistId) {

            dispatch(updatePlayer({
                show: true,
                isLoading: true
            }))

            if (playlist && playlist[0]?.playlistId === playlistId) {
                // shuffle the array
                const shuffled = playlist?.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1])
                dispatch(setPlayList({
                    playlist: shuffled,
                }))

                await PlaySong(0, shuffled[0].videoId, null, playlistId)

                return
            }

            const { playlist: cPlaylist } = await getQueue({ playlistId })

            if (cPlaylist) {
                // shuffle the array
                const shuffled = cPlaylist?.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1])

                dispatch(setPlayList({
                    playlist: shuffled,
                }))
                await PlaySong(0, shuffled[0].videoId, null , playlistId)
            }
        }
    }

    return (
        <View style={{ paddingTop: 15 }}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => shufflePlay(data)} style={style.shufflePlay}>
                    <Ionicons name="play" size={25} color={theme.txt} />
                </TouchableOpacity>
            </View>
            <Text style={style.heading}>Popular</Text>

            {data && data.map((song, i) => {
                return (
                    <TouchableNativeFeedback key={`SONGS_MAIN_ARTIST_PAGE_${i}`} onPress={() => handlePress(song, i)}>
                        <View style={{ flexDirection: 'row', padding: 5, paddingLeft: 10 }}>
                            <FastImage style={style.image} source={{ uri: song.thumbnail }} />
                            <View style={{ flex: 1, paddingLeft: 15, justifyContent: 'center', paddingRight: 15 }}>
                                <Text style={style.title} numberOfLines={2}>{song.title}</Text>
                                <Text numberOfLines={1} style={{ flexDirection: 'row', }}>
                                    {song.subtitle.map((subtitle, i) => {
                                        return (
                                            <Text key={"SUBTITLE_ARTIST_PAGE" + i} style={style.subtitle}>{subtitle.text}</Text>
                                        )
                                    })}
                                </Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                )
            })}
        </View>

    )
}

const style = StyleSheet.create({
    heading: {
        fontSize: 20,
        color: theme.txt,
        fontWeight: 'bold',
        paddingBottom: 15,
        paddingHorizontal: 10
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    title: {
        fontSize: 16,
        color: theme.txt,
    },
    subtitle: {
        color: theme.txtSy,
        fontSize: 14
    },
    shufflePlay: {
        width: 55,
        height: 55,
        borderRadius: 100,
        backgroundColor: theme.brand,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        position: 'absolute',
        top: -30,
        right: 20
    }
})
