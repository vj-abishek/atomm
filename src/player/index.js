import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, ActivityIndicator, TouchableHighlight, AppState } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import theme from '../theme/theme'
import TrackPlayer, { Event, usePlaybackState, useTrackPlayerEvents, State, useProgress } from 'react-native-track-player';
import { useSelector } from 'react-redux'
import { Next } from '../utils/play'
import { Image } from 'react-native-elements/dist/image/Image'
import { useNavigation } from '@react-navigation/native';

let data = {}


export const togglePlayback = async (playbackState) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();

    if (currentTrack === null) {
        if (data?.url) {
            const { url, title, artist, artwork, duration } = data
            await TrackPlayer.add({
                url,
                title,
                artist,
                artwork,
                duration,
            })

            await TrackPlayer.play()
        }

    } else {
        try {
            if (playbackState !== State.Playing) {
                await TrackPlayer.play();
            } else {
                await TrackPlayer.pause();
            }
        } catch (err) {
            console.log(err)
        }
    }
};

export default function index() {
    const navigation = useNavigation()
    const { bottomPlayerStatus, vibrant, playerStatus } = useSelector(state => state.player)
    const playbackState = usePlaybackState();
    const [trackTitle, setTrackTitle] = useState('');
    const [artwork, setArtwork] = useState(null);
    const [artist, setArtist] = useState(null)
    const [url, setUrl] = useState(null)
    const [duration, setDuration] = useState(null)
    const [appState, setAppState] = useState('active')
    const { duration: Progressduration, position } = useProgress(
        appState === 'active' ? 1000 : 50000
    )
    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
        if (
            event.type === Event.PlaybackTrackChanged &&
            event.nextTrack !== undefined
        ) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const { artwork } = track || {};
            setArtwork(() => artwork);

            data = {
                url,
                artist,
                duration,
                title: trackTitle,
                artwork
            }
        }
    });

    useEffect(() => {
        if (playerStatus.thumbnail) {
            setTrackTitle(() => playerStatus.title);
            setArtist(() => playerStatus.artist);
            setUrl(() => playerStatus.url);
            setDuration(() => playerStatus.duration);
        }
    }, [playerStatus])

    const appStateChange = appState => setAppState(appState)

    useEffect(() => {
        const subscription = AppState.addEventListener('change', appStateChange)
        return () => subscription.remove()
    }, [])

    return (bottomPlayerStatus?.show) ? (
        <TouchableHighlight onPress={() => navigation.navigate('PlayerUI')}>
            <>
                <View style={[styles.progress, { backgroundColor: vibrant.secondary }]}>
                    <View style={{ backgroundColor: theme.brand, borderRadius: 16, width: `${(position / Progressduration) * 100}%`, transition: 'width 0.75s ease' }}></View>
                </View>
                <View style={[styles.player, { backgroundColor: vibrant.secondary }]}>
                    {artwork ? (
                        <Image
                            style={styles.imageStyle}
                            source={{
                                uri: artwork,
                            }}
                            resizeMode="cover"
                            PlaceholderContent={<ActivityIndicator size="small" color={theme.txt} />}
                        />
                    ) : (
                        <View style={{ width: 40, height: 40, borderRadius: 8, marginLeft: 10 }}>
                        </View>
                    )}
                    <View style={styles.playerContainer}>
                        <View style={styles.text}>
                            <Text
                                numberOfLines={1}
                                style={{ color: theme.txt }}
                            >
                                {trackTitle}
                            </Text>
                            <Text numberOfLines={1} style={{ color: theme.txtSy }}>{artist}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={() => togglePlayback(playbackState)}>
                            <View style={styles.playButton}>
                                {bottomPlayerStatus.isLoading || playbackState === State.Buffering || playbackState === State.Connecting ? (
                                    <ActivityIndicator size="small" color={theme.txt} />
                                ) : (
                                    playbackState === State.Playing ? (
                                        <FontAwesome name="pause" color={theme.txt} size={16} />
                                    ) : (
                                        <FontAwesome style={{ marginLeft: 2 }} name="play" color={theme.txt} size={16} />
                                    )
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={Next}>
                            <View style={{ flex: 1, marginRight: 20 }}>
                                <MaterialIcon style={{ marginLeft: 20 }} name="skip-next" color={theme.txt} size={35} />
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </View>
            </>
        </TouchableHighlight>
    ) : null
}

const styles = StyleSheet.create({
    player: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        transition: 'background 0.75s ease'
    },
    text: {
        color: theme.txt,
        flex: 2,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center'
    },
    icon: {
        marginLeft: 10
    },
    playerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    playButton: {
        height: 35,
        width: 35,
        borderRadius: 50,
        backgroundColor: theme.brand,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2
    },
    imageStyle: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginLeft: 10,
    },
    progress: {
        flexDirection: 'row',
        width: '100%',
        height: 2,
        backgroundColor: theme.sy
    }
})
