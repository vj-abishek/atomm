import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableNativeFeedback } from 'react-native'
import { Image } from 'react-native-elements'
import { useDispatch } from 'react-redux'
import { getPlaylistThunk, setPlayList, updatePlayer } from '../../store/features/playerSlice'
import theme from '../../theme/theme'
import { PlaySong } from '../../utils/play'

export default function Feed({ searchData, navigation }) {
    const dispatch = useDispatch()
    let correctedQuery, didYouMean;


    if (searchData?.itemSectionRenderer) {
        correctedQuery = searchData?.itemSectionRenderer?.contents[0]?.showingResultsForRenderer?.correctedQuery?.runs[0]?.text
        didYouMean = searchData?.itemSectionRenderer?.contents[0]?.didYouMeanRenderer?.correctedQuery?.runs[0]?.text
    }

    const title = searchData?.musicShelfRenderer?.title && searchData?.musicShelfRenderer?.title?.runs[0]?.text
    const content = searchData?.musicShelfRenderer && searchData?.musicShelfRenderer?.contents

    const handlePress = async (data, c, subtitle, thumbnail) => {

        const playlistId = data?.navigationEndpoint?.watchEndpoint?.playlistId
        const videoId = data?.navigationEndpoint?.watchEndpoint?.videoId


        if (videoId && !playlistId) {
            dispatch(updatePlayer({
                show: true,
                isLoading: true
            }))

            await PlaySong(0, videoId, thumbnail)
            return
        }

        if (playlistId && videoId) {
            dispatch(updatePlayer({
                show: true,
                isLoading: true
            }))

            await PlaySong(0, videoId, thumbnail)

            const { playlist: cPlaylist } = await getPlaylistThunk({ videoId, playlistId })
            dispatch(setPlayList({
                playlist: cPlaylist
            }))
            return
        }


        const endpoint = c?.musicResponsiveListItemRenderer?.navigationEndpoint?.browseEndpoint
        const type = endpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType

        if (type === 'MUSIC_PAGE_TYPE_ALBUM') {
            const obj = {}

            obj.browseId = endpoint.browseId
            obj.thumbnails = c.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[2].url
            obj.subtitle = subtitle
            obj.type = 'Album'

            navigation.navigate('SearchAlbum',
                {
                    title: data.text,
                    obj,
                })

            return
        }

        if (type === 'MUSIC_PAGE_TYPE_PLAYLIST') {
            const obj = {}

            obj.browseId = endpoint.browseId
            obj.thumbnails = c?.musicResponsiveListItemRenderer?.thumbnail?.musicThumbnailRenderer?.thumbnail.thumbnails[2].url
            obj.subtitle = subtitle
            obj.type = 'playlist'

            navigation.navigate('SearchAlbum',
                {
                    title: data.text,
                    obj,
                })

            return
        }
    }
    return searchData?.itemSectionRenderer ? (
        <View style={{ marginLeft: 20, marginTop: 15, color: theme.txt }}>
            <Text style={styles.title}>
                <Text>Showing results for: </Text>
                <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{correctedQuery || didYouMean}</Text>
            </Text>
        </View>
    ) : (
        <View style={{ marginBottom: 5, padding: 10 }}>
            {!('itemSectionRenderer' in searchData) && <Text style={styles.heading}>{title}</Text>}

            {
                content && !('itemSectionRenderer' in searchData) && content?.map((c, i) => {
                    if ('itemSectionRenderer' in c) return null

                    if ('musicResponsiveListItemRenderer' in c) {
                        const songTitle = c?.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0]
                        const subtitle = c?.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs

                        if (!c?.musicResponsiveListItemRenderer?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails) return null

                        let thumbnail = c?.musicResponsiveListItemRenderer?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails[0].url;

                        return (
                            <TouchableNativeFeedback key={`serchResultmE${i}`} onPress={() => handlePress(songTitle, c, subtitle, thumbnail)}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ padding: 10 }}>
                                        <Image
                                            style={styles.imageStyle}
                                            source={{
                                                uri: thumbnail,
                                            }}
                                            resizeMode="cover"
                                            PlaceholderContent={<ActivityIndicator size="small" color={theme.txt} />}
                                        />
                                    </View>
                                    <View style={{ padding: 10, flex: 1 }}>
                                        <Text numberOfLines={2} style={{ fontSize: 16, color: theme.txt }}>{songTitle.text}</Text>
                                        <Text style={{ flexDirection: 'row', color: theme.txtSy }} numberOfLines={2}>
                                            {subtitle?.map((sub, i) => <Text key={`searchResultSbTitle${i}`}>{sub.text}</Text>)}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        )
                    }
                })
            }
        </View >
    )
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 23,
        fontWeight: 'bold',
        padding: 10,
        marginTop: 5,
        color: theme.txt
    },
    imageStyle: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    title: {
        color: theme.txt,
        fontSize: 16,
    }
})
