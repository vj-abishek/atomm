import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState, useRef } from 'react'
import { View, StyleSheet,  ActivityIndicator, TouchableWithoutFeedback, Text,  Dimensions } from 'react-native'
import { Image } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import Slider from '@react-native-community/slider'
import BottomSheet from "react-native-gesture-bottom-sheet";
import TrackPlayer, {  useProgress, usePlaybackState, State } from 'react-native-track-player'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useSelector } from 'react-redux'
import { togglePlayback } from '../player'
import theme from '../theme/theme'
import Playlist from '../components/Playlist/index'
import { Previous, Next, shadeColor } from '../utils/play'

// seconds to minutes
const secToMin = (sec) => {
    const minutes = Math.floor(sec / 60)
    const seconds = sec - minutes * 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

// get height from dimensions react native
const getHeightFromDimensions = () => {
    const { height: screenHeight } = Dimensions.get('window')
    return screenHeight / 2
}


export default function PlayerUI() {
    const [title, setTrackTitle] = useState('')
    const [artist, setTrackArtist] = useState('')
    const [artwork, setTrackArtwork] = useState(null)
    const { bottomPlayerStatus, playerStatus, vibrant } = useSelector(state => state.player)

    const navigation = useNavigation()
    const progress = useProgress()
    const playbackState = usePlaybackState();

    const bottomSheet = useRef()

    useEffect(() => {
        if (playerStatus.thumbnail) {
            setTrackArtwork(playerStatus.thumbnail)
            setTrackTitle(playerStatus.title);
            setTrackArtist(playerStatus.artist)
        }
    }, [playerStatus])

    return (
        <LinearGradient
            colors={[vibrant.primary, theme.bg]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={Styles.container}
        >
            <View style={{maxWidth: 500, width: '85%' ,flex: 1, bottom: 0, position: 'absolute'}}>
                <View>
                    {artwork ? (
                        <Image
                            style={Styles.imageStyle}
                            source={{
                                uri: artwork,
                            }}
                            resizeMode="cover"
                            PlaceholderContent={<ActivityIndicator size="small" color={theme.txt} />}
                        />
                    ) : (
                        <View style={{ width: '100%', elevation: 3, height: '100%', borderRadius: 8, marginLeft: 10, backgroundColor: theme.sy }}>
                        </View>
                    )}
                    <View style={{ width: '100%', marginTop: 30 }}>
                        <Text numberOfLines={1} style={Styles.title}>{title}</Text>
                        <Text numberOfLines={1} style={Styles.subtitle}>{artist}</Text>
                    </View>


                    <View style={{ flexDirection: 'row', width: '100%', marginTop: -10 }}>
                        <View style={{ width: '100%' }}>
                            <Slider
                                style={Styles.progressContainer}
                                value={progress.position}
                                minimumValue={0}
                                maximumValue={progress.duration}
                                allowTouchTrack
                                thumbTintColor={theme.txt}
                                minimumTrackTintColor={theme.bg}
                                maximumTrackTintColor={theme.sy}
                                thumbStyle={{ width: 12, height: 12, borderRadius: 10 }}
                                onSlidingComplete={async (value) => {
                                    await TrackPlayer.seekTo(value)
                                }}
                            />
                            <View style={Styles.progressLabel}>
                                <Text style={Styles.progressLabelText}>
                                    {new Date(progress.position * 1000).toISOString().substr(14, 5)}
                                </Text>
                                <Text style={Styles.progressLabelText}>
                                    {secToMin(progress.duration)}
                                </Text>
                            </View>
                        </View>

                    </View>

                    <View style={Styles.playerConatiner}>
                        <View style={{ flexDirection: 'row', height: 70, justifyContent: 'center', alignItems: 'center', width: '94%' }}>
                            <TouchableWithoutFeedback onPress={() => Previous()}>
                                <View style={{ marginRight: 40 }}>
                                    <MaterialIcon style={{ marginLeft: 20 }} name="skip-previous" color={theme.txt} size={35} />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => togglePlayback(playbackState)}>
                                <View style={Styles.playButton}>
                                    {bottomPlayerStatus.isLoading || playbackState === State.Buffering || playbackState === State.Connecting ? (
                                        <ActivityIndicator size="large" color={theme.txt} />
                                    ) : (
                                        playbackState === State.Playing ? (
                                            <FontAwesome name="pause" color={theme.txt} size={25} />
                                        ) : (
                                            <FontAwesome style={{ marginLeft: 2 }} name="play" color={theme.txt} size={25} />
                                        )
                                    )}
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => Next()}>
                                <View>
                                    <MaterialIcon style={{ marginLeft: 40 }} name="skip-next" color={theme.txt} size={35} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>

                <View style={Styles.header}>
                    <TouchableWithoutFeedback onPress={() => navigation.pop()}>
                        <AntDesign name="close" size={25} color={theme.txt} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => bottomSheet.current.show()}
                    >
                        <MaterialIconCommunity name="playlist-music" size={25} color={theme.txt} />
                    </TouchableWithoutFeedback>
                </View>
            </View>

            <BottomSheet hasDraggableIcon ref={bottomSheet} height={getHeightFromDimensions()} sheetBackgroundColor={shadeColor(vibrant.primary, -60)}>
                <Playlist />
            </BottomSheet>
        </LinearGradient>
    )
}

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
        marginRight: 15,
        marginLeft: 15,
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
        justifyContent: 'space-between'
    }
})
