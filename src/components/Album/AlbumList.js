import React from 'react'
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native'
import { getPlaylistThunk,  setPlayList,  updatePlayer } from '../../store/features/playerSlice'
import theme from '../../theme/theme'
import { useDispatch } from 'react-redux'
import { PlaySong } from '../../utils/play'

export default function AlbumList({ list, obj }) {
    const dispatch = useDispatch()

    const title = list.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text
    const subtitle = list.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs
    const duration = list.fixedColumns[0].musicResponsiveListItemFixedColumnRenderer.text.runs[0].text
    const index = list.index.runs[0].text
    const { videoId } = list.playlistItemData
    const currentIndex = parseInt(index) - 1


    const getNextList = async () => {

        dispatch(updatePlayer({
            show: true,
            isLoading: true
        }))

        const { playlist: cPlaylist } = await getPlaylistThunk({ videoId, playlistId: obj.playlistId })

        dispatch(setPlayList({
            playlist: cPlaylist
        }))

        await PlaySong(currentIndex, obj.videoId)
    }

    return (
        <TouchableNativeFeedback onPress={getNextList}>
            <View style={styles.container}>
                <View style={{flexDirection: 'row', flex: 2}}>
                    <Text style={styles.index}>{index}</Text>
                    <View style={{flex: 2}}>
                        <Text style={styles.itemText}>{title}</Text>
                        <Text numberOfLines={1} style={styles.subtitle}>
                            {subtitle && subtitle?.map((st, i) => (
                                <Text key={`From_Music_SB_Album_Main_subtitle_T${i}`}>{st.text}</Text>
                            ))}
                        </Text>
                    </View>
                </View>
                <Text>{duration}</Text>
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
        textAlign: 'center',
        padding: 8,
        fontSize: 16,
        marginRight: 13,
        width: 35
    }
})
