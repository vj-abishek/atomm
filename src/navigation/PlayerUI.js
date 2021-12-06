import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, Text, AppState, TouchableOpacity, StatusBar } from 'react-native'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import Slider from '@react-native-community/slider'
import { useMMKVStorage } from "react-native-mmkv-storage";
import TrackPlayer, { useProgress, usePlaybackState, State } from 'react-native-track-player'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import { togglePlayback } from '../player'
import theme from '../theme/theme'
import { Previous, Next } from '../utils/play'
import { MMKV } from '../storage/index'

// second to HH:MM:SS and show hour only if > 1 hour
const secToTime = (sec) => {
    const hours = Math.floor(sec / 3600)
    const minutes = Math.floor((sec - hours * 3600) / 60)
    const seconds = sec - hours * 3600 - minutes * 60
    return `${hours > 0 ? `${hours}:` : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

function PlayerUI() {
    const { bottomPlayerStatus, vibrant } = useSelector(state => state.player)
    const dispatch = useDispatch()

    const navigation = useNavigation()
    const [appState, setAppState] = useState('active')
    const { duration, position } = useProgress(
        appState === 'active' ? 1000 : 50000
    )
    const playbackState = usePlaybackState();
    const [localData, setLocalData] = useMMKVStorage('currentsong', MMKV, null)

    const appStateChange = appState => setAppState(appState)

    useEffect(() => {
        const subscription = AppState.addEventListener('change', appStateChange)
        return () => subscription.remove()
    }, [])

    return (localData) ? (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <LinearGradient
                colors={[vibrant.primary, theme.bg]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={Styles.container}
            >
                <View style={{ maxWidth: 500, width: '85%', flex: 1, bottom: 0, position: 'absolute' }}>
                    <View>
                        {localData.artwork ? (
                            <FastImage
                                style={[Styles.imageStyle]}
                                source={{
                                    uri: localData.artwork,
                                    priority: FastImage.priority.high,
                                }}
                            />

                        ) : (
                            <View style={{ width: '100%', elevation: 3, height: '100%', borderRadius: 8, marginLeft: 10, backgroundColor: theme.sy }}>
                            </View>
                        )}
                        <View style={{ width: '100%', marginTop: 30 }}>
                            <Text numberOfLines={1} style={Styles.title}>{localData.title}</Text>
                            <Text numberOfLines={1} style={Styles.subtitle}>{localData.artist}</Text>
                        </View>


                        <View style={{ flexDirection: 'row', width: '100%', marginTop: -15 }}>
                            <View style={{ width: '100%' }}>
                                <Slider
                                    style={Styles.progressContainer}
                                    value={position}
                                    minimumValue={0}
                                    maximumValue={duration}
                                    allowTouchTrack
                                    thumbTintColor={theme.txt}
                                    minimumTrackTintColor={theme.txt}
                                    maximumTrackTintColor={theme.txt}
                                    thumbStyle={{ width: 12, height: 12, borderRadius: 10 }}
                                    onSlidingComplete={async (value) => {
                                        await TrackPlayer.seekTo(value)
                                    }}
                                />
                                <View style={Styles.progressLabel}>
                                    <Text style={Styles.progressLabelText}>
                                        {new Date(position * 1000).toISOString().substr(14, 5)}
                                    </Text>
                                    <Text style={Styles.progressLabelText}>
                                        {secToTime(duration)}
                                    </Text>
                                </View>
                            </View>

                        </View>

                        <View style={Styles.playerConatiner}>
                            <View style={{ flexDirection: 'row', height: 70, justifyContent: 'center', alignItems: 'center', width: '94%' }}>
                                <TouchableOpacity onPress={() => Previous()}>
                                    <View style={{ marginRight: 40 }}>
                                        <MaterialIcon style={{ marginLeft: 20 }} name="skip-previous" color={theme.txt} size={35} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => togglePlayback(playbackState, localData, dispatch)}>
                                    <View style={Styles.playButton}>
                                        {bottomPlayerStatus.isLoading || playbackState === State.Buffering || playbackState === State.Connecting ? (
                                            <ActivityIndicator size="large" color={theme.txt} />
                                        ) : (
                                            playbackState === State.Playing ? (
                                                <FontAwesome name="pause" color={theme.txt} size={25} />
                                            ) : (
                                                <Ionicons name="play" color={theme.txt} size={30} />
                                            )
                                        )}
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Next()}>
                                    <View>
                                        <MaterialIcon style={{ marginLeft: 40 }} name="skip-next" color={theme.txt} size={35} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={Styles.header}>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.pop()}>
                            <AntDesign name="close" size={25} color={theme.txtSy} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10 }}
                            onPress={() => navigation.navigate('Playlist')}
                        >
                            <MaterialIconCommunity name="playlist-music" size={25} color={theme.txtSy} />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </>
    ) : null
}

export default PlayerUI;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    imageStyle: {
        width: '100%',
        borderRadius: 5,
        aspectRatio: 1 / 1,
    },
    title: {
        fontSize: 22,
        color: theme.txt,
        fontWeight: '600',
    },
    subtitle: {
        color: theme.txtSy,
        fontSize: 16,
    },
    progressContainer: {
        height: 40,
        width: '100%',
        marginTop: 25,
    },
    progressLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 10,
        marginLeft: 10,
    },
    progressLabelText: {
        color: theme.txtSy,
        fontSize: 12,
    },
    playButton: {
        height: 65,
        width: 65,
        borderRadius: 50,
        backgroundColor: theme.brand,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2
    },
    playerConatiner: {
        width: '100%',
        flex: 1,
        padding: 20,
        height: 70,
        flexDirection: 'row',
    },
    header: {
        width: '85%',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 50,
        marginBottom: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})
