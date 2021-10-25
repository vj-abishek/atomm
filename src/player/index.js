import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import theme from '../theme/theme'
import TrackPlayer, {  Event, usePlaybackState, useTrackPlayerEvents, State } from 'react-native-track-player';
import {  useSelector } from 'react-redux'
import { Next } from '../utils/play'


const togglePlayback = async (playbackState) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
      // TODO: Perhaps present an error or restart the playlist?
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

    const { bottomPlayerStatus } = useSelector(state => state.player)
    const playbackState = usePlaybackState();
    const [trackTitle, setTrackTitle] = useState('Loading...');

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
      if (
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack !== undefined
      ) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        const {title } = track || {};
        setTrackTitle(title);
      }
    });

    return (bottomPlayerStatus?.show) ? (
        <View style={styles.player}>
                <MaterialIcon style={styles.icon} name="keyboard-arrow-up" size={40} color={theme.txt}/>
                <View style={styles.playerContainer}>
                    <Text
                        numberOfLines={1}
                        style={styles.text}>
                            {trackTitle}
                    </Text>
                    <TouchableWithoutFeedback onPress={() => togglePlayback(playbackState)}>
                        <View style={styles.playButton}>
                            {bottomPlayerStatus.isLoading ? (
                                <ActivityIndicator size="small" color={theme.txt} />
                            ) : (
                                playbackState === State.Playing ? (
                                    <FontAwesome name="pause" color={theme.txt} size={16}/>
                                ) : (
                                    <FontAwesome style={{marginLeft: 2}} name="play" color={theme.txt} size={16}/>
                                )
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={Next}>
                        <View style={{flex: 1, marginRight: 20}}>
                            <MaterialIcon style={{marginLeft: 20}} name="skip-next" color={theme.txt} size={35}/>
                        </View>
                    </TouchableWithoutFeedback>

                </View>
        </View>
    ) : null
}

const styles = StyleSheet.create({
    player: {
        width: '100%',
        height: 50,
        backgroundColor: theme.sy,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        color: theme.txt,
        flex: 2,
        marginLeft: 10,
        textAlign: 'center',
        marginRight: 10
    },
    icon: {
        marginLeft: 10
    },
    playerContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    playButton: {
        height: 35,
        width: 35,
        borderRadius: 50,
        backgroundColor: theme.sy,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
