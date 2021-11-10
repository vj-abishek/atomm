import React from 'react'
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native'
import { getPlaylistThunk, setPlayList, updatePlayer } from '../../store/features/playerSlice'
import theme from '../../theme/theme'
import { useDispatch } from 'react-redux'
import { PlaySong } from '../../utils/play'

export default function AlbumList({ list, i, obj }) {
    const dispatch = useDispatch()
    let title, playlistId, videoId, subtitle, currentIndex, duration, index;
    const thumbnail = obj.thumbnails

    // if it is playlist
    if (list?.videoId) {
        const { title: tl, playlistId: plId, videoId: vdId, subtitle: st } = list

        title = tl
        playlistId = plId
        videoId = vdId
        subtitle = st
        currentIndex = i
        index = i + 1

    } else if (list?.flexColumns) { // if it is a album
        const { text, navigationEndpoint } = list?.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0]
        const st = list?.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs
        const dt = list?.fixedColumns[0].musicResponsiveListItemFixedColumnRenderer.text.runs[0].text
        const inx = list?.index.runs[0].text
        const { videoId: vdId } = list.playlistItemData
        const cI = parseInt(inx) - 1

        title = text
        videoId = vdId
        subtitle = st
        duration = dt
        currentIndex = cI
        index = inx
        playlistId = navigationEndpoint.watchEndpoint.playlistId
    } else return null


    const getNextList = async () => {

        dispatch(updatePlayer({
            show: true,
            isLoading: true
        }))

        await PlaySong(currentIndex, videoId, thumbnail, true)

        const { playlist: cPlaylist } = await getPlaylistThunk({ videoId, playlistId })

        if (cPlaylist) {
            dispatch(setPlayList({
                playlist: cPlaylist
            }))
        }
    }

    return (
        <TouchableNativeFeedback onPress={getNextList}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', flex: 2 }}>
                    <Text style={styles.index}>{index}</Text>
                    <View style={{ flex: 2 }}>
                        <Text style={styles.itemText}>{title}</Text>
                        <Text numberOfLines={1} style={styles.subtitle}>
                            {subtitle && subtitle?.map((st, i) => (
                                <Text key={`From_Music_SB_Album_Main_subtitle_T${i}`}>{st.text}</Text>
                            ))}
                        </Text>
                    </View>
                </View>
                {duration && (<Text style={styles.duration}>{duration}</Text>)}
            </View>
        </TouchableNativeFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: 'row',
        paddingRight: 30,
        justifyContent: 'space-between',
        flex: 1
    },
    itemText: {
        color: theme.txt,
        fontSize: 16,
        marginTop: 5,
        flexWrap: 'wrap',
        paddingRight: 20

    },
    subtitle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingRight: 10,
        fontSize: 14,
    },
    index: {
        padding: 8,
        fontSize: 16,
        marginRight: 13,
        width: 35,
        color: theme.txtSy
    },
    duration: {
        color: theme.txtSy,
    }

})
