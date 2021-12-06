import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useDispatch, useSelector } from 'react-redux'
import { getPlaylistThunk, getQueue, setPlayList, updatePlayer } from '../../store/features/playerSlice'
import theme from '../../theme/theme'
import { PlaySong } from '../../utils/play'

export default function Header({ obj, title, albumList }) {

    const dispatch = useDispatch()
    const { playlist } = useSelector(state => state.player)

    const handlePress = async () => {
        const { navigationEndpoint } = albumList[0]?.musicResponsiveListItemRenderer?.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]
        const playlistId = navigationEndpoint?.watchEndpoint?.playlistId
        const videoId = navigationEndpoint?.watchEndpoint?.videoId

        if (videoId && playlistId) {
            dispatch(updatePlayer({
                show: true,
                isLoading: true
            }))


            if (playlist && playlist[0]?.playlistId === playlistId) {
                // shuffle the array
                const shuffled = playlist.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1])
                dispatch(setPlayList({
                    playlist: shuffled,
                }))

                await PlaySong(0, shuffled[0].videoId, null, playlistId)

                return
            }

            const { playlist: cPlaylist } = await getQueue({ playlistId })

            if (cPlaylist) {
                // shuffle the array
                const shuffled = cPlaylist.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1])

                dispatch(setPlayList({
                    playlist: shuffled,
                }))

                await PlaySong(0, shuffled[0].videoId, null, playlistId)

            }

        }
    }
    return (
        <View style={styles.headerContainer}>
            <FastImage
                source={{
                    uri: obj.thumbnails,
                }}
                style={styles.imageStyle}
            />
            <Text style={styles.heading}>{title}</Text>
            <Text style={{ marginTop: 3, textAlign: 'center' }}>
                {obj.subtitle.map((st, i) => (
                    <Text key={`FroM_album_Main_subtitle_T${i}`}>{st.text}</Text>
                ))}
            </Text>
            {albumList[0]?.musicResponsiveListItemRenderer && (
                <TouchableOpacity style={styles.playAll} onPress={handlePress}>
                    <Text style={styles.appButtonText}>SHUFFLE PLAY</Text>
                </TouchableOpacity >
            )}

        </View>
    )
}


const styles = StyleSheet.create({
    headerContainer: {
        marginTop: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
    },
    heading: {
        color: theme.txt,
        fontSize: 25,
        textAlign: 'center',
        marginTop: 15,
        padding: 10
    },
    imageStyle: {
        width: 200,
        height: 200,
        borderRadius: 8,
    },
    playAll: {
        marginTop: 20,
        backgroundColor: theme.brand,
        borderRadius: 50,
        paddingVertical: 15,
        paddingHorizontal: 62,
    },
    appButtonText: {
        fontSize: 18,
        color: theme.txt,
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    }
})