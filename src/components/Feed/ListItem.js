import React, { PureComponent } from 'react'
import { Text, StyleSheet, ActivityIndicator, View, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements';
import { connect } from 'react-redux'
import { add, addAlbum, getPlaylistThunk, setPlayList, updatePlayer } from '../../store/features/playerSlice';
import theme from '../../theme/theme';
import { PlaySong } from '../../utils/play';

class ListItem extends PureComponent {
    handlePress = async (params) => {
        let obj = {}
        if ('videoId' in params && !('playlistId' in params)) {
            this.props.updatePlayer({
                show: true,
                isLoading: true
            })

            await PlaySong(0, params.videoId, params.thumbnails[0].url)
            return
        }
        if ('videoId' in params && 'playlistId' in params) {
            obj.isSong = true
            obj.title = params.title
            obj.artwork = params.thumbnails[0].url
            obj.videoId = params.videoId
            obj.playlistId = params.playlistId

            this.props.updatePlayer({
                show: true,
                isLoading: true
            })

            await PlaySong(-1, params.videoId, params.thumbnails[0].url, params.playlistId)

            const musicVideoType = params?.musicVideoType
            console.log(musicVideoType, params)

            const { playlist: cPlaylist } = await getPlaylistThunk({ videoId: params.videoId, playlistId: params.playlistId, musicVideoType })

            this.props.setPlayList({
                playlist: cPlaylist,
            })
            return
        }

        if ('endpoint' in params) {
            obj.isSong = false
            obj.browseId = params.endpoint.browseId
            obj.thumbnails = params.thumbnails[0].url
            obj.subtitle = params.subtitle
            obj.playlistId = params.playlistId
            this.props.navigation.navigate('HomeAlbum',
                {
                    title: params.title,
                    obj,
                })
        }

    }

    render() {
        const { item, section } = this.props
        let conditionalStyle = null
        if (section.title) {
            conditionalStyle = section.title.includes('singles') ? StyleSheet.create({
                width: 200,
                height: 200,
                borderRadius: 8,
            }) : StyleSheet.create({
                borderRadius: 8,
                aspectRatio: 16 / 9,
            })
        }

        return item?.thumbnails?.length ? (
            <TouchableOpacity onPress={() => this.handlePress(item)} >
                <View style={styles.item}>
                    <Image
                        source={{
                            uri: item && item.thumbnails[0].url,
                        }}
                        style={conditionalStyle}
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator size="small" color={theme.txt} />}
                    />
                    <Text numberOfLines={2} style={styles.itemText}>{item.title}</Text>
                    <Text numberOfLines={1} style={styles.subtitle}>
                        {item.subtitle.map((st, i) => (
                            <Text key={`subtitle_T${i}`}>{st.text}</Text>
                        ))}
                    </Text>
                </View>
            </TouchableOpacity>

        ) : null
    }
}

export default connect(null, { add, addAlbum, setPlayList, updatePlayer })(ListItem)

const styles = StyleSheet.create({
    item: {
        margin: 10,
        width: 200,
    },
    itemText: {
        color: theme.txt,
        fontSize: 16,
        marginTop: 5,
    },
    subtitle: {
        flexDirection: 'row'
    }
})