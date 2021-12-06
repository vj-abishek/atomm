import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, ActivityIndicator, TouchableHighlight, AppState } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useMMKVStorage } from "react-native-mmkv-storage";
import theme from '../theme/theme'
import TrackPlayer, { usePlaybackState, State, useProgress } from 'react-native-track-player';
import { useSelector, useDispatch } from 'react-redux'
import { Next, PlaySong } from '../utils/play'
import { Image } from 'react-native-elements/dist/image/Image'
import { useNavigation } from '@react-navigation/native';
import { getPlaylistThunk, setPlayList, updatePlayer } from '../store/features/playerSlice';
import { MMKV } from '../storage/index';

export const togglePlayback = async (playbackState, localData, dispatch) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();

    if (currentTrack === null) {
        dispatch(updatePlayer({
            show: true,
            isLoading: true
        }))

        await PlaySong(0, localData.videoId, localData.artwork, localData.playlistId)

        if (localData.playlistId) {
            const { playlist: cPlaylist } = await getPlaylistThunk({ videoId: localData.videoId, playlistId: localData.playlistId })

            dispatch(setPlayList({
                playlist: cPlaylist,
            }))
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
    const { bottomPlayerStatus, vibrant } = useSelector(state => state.player)
    const playbackState = usePlaybackState();
    const [appState, setAppState] = useState('active')
    const { duration: Progressduration, position } = useProgress(
        appState === 'active' ? 1000 : 50000
    )
    const [localData, setLocalData] = useMMKVStorage('currentsong', MMKV, null)
    const dispatch = useDispatch()

    const appStateChange = appState => setAppState(appState)

    useEffect(() => {
        const subscription = AppState.addEventListener('change', appStateChange)
        return () => subscription.remove()
    }, [])

    useEffect(() => {
        const loadFromStorage = async () => {
            if (localData) {
                dispatch(updatePlayer({
                    show: true
                }))
            }
        }

        loadFromStorage()
    }, [localData])

    return (bottomPlayerStatus?.show) ? (
        <TouchableHighlight onPress={() => navigation.navigate('PlayerUI')}>
            <>
                <View style={[styles.progress, { backgroundColor: vibrant.secondary }]}>
                    <View style={{ backgroundColor: theme.brand, borderRadius: 16, width: `${(position / Progressduration) * 100}%`, transition: 'width 0.75s ease' }}></View>
                </View>
                <View style={[styles.player, { backgroundColor: vibrant.secondary }]}>
                    {localData?.artwork ? (
                        <Image
                            style={styles.imageStyle}
                            source={{
                                uri: localData?.artwork?.replace('h544', 'h226').replace('w544', 'w226'),
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
                                {localData?.title}
                            </Text>
                            <Text numberOfLines={1} style={{ color: theme.txtSy }}>{localData?.artist}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={() => togglePlayback(playbackState, localData, dispatch)}>
                            <View style={styles.playButton}>
                                {bottomPlayerStatus.isLoading || playbackState === State.Buffering || playbackState === State.Connecting ? (
                                    <ActivityIndicator size="small" color={theme.txt} />
                                ) : (
                                    playbackState === State.Playing ? (
                                        <FontAwesome name="pause" color={theme.txt} size={16} />
                                    ) : (
                                        <Ionicons name="play" color={theme.txt} size={20} />
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
        paddingVertical: 8,
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
        width: 45,
        height: 45,
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
