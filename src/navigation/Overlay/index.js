import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableHighlight, StatusBar, ToastAndroid } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FastImage from 'react-native-fast-image'
import { MMKV } from '../../storage'
import theme from '../../theme/theme'


const likesDB = 'likes'

export default function index({ route, navigation }) {
    const { params } = route

    const [liked, setLiked] = useState(false)

    useEffect(() => {
        const isLiked = MMKV.getArray(likesDB)?.some((al) => al.videoId === params.list.videoId)

        if (isLiked) {
            setLiked(true)
        }
    }, [])

    const handleHeart = (item) => {

        const old = MMKV.getArray(likesDB)

        setLiked(true)

        if (old) {
            const isAlreadyPresent = old.some((itm) => itm.videoId === item.videoId)

            if (isAlreadyPresent) {
                old.forEach((itm, i) => {
                    if (itm.videoId === item.videoId) {
                        old.splice(i, 1)
                        return
                    }
                })

                setLiked(false)
                MMKV.setArray(likesDB, old)
                ToastAndroid.show('Removed from Liked Songs.', ToastAndroid.SHORT);
                return
            }

            old.push(item)
            MMKV.setArray(likesDB, old)
            ToastAndroid.show('Added to Liked Songs.', ToastAndroid.SHORT);
            return
        }

        MMKV.setArray(likesDB, [item])
        ToastAndroid.show('Added to Liked Songs.', ToastAndroid.SHORT);

    }

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <FastImage source={{ uri: params.thumbnail }} style={{ width: 200, height: 200 }} />
                    <Text numberOfLines={2} style={[styles.heading, { padding: 15 }]}>{params.title}</Text>
                    <View style={styles.options}>
                        {liked ? (
                            <>
                                <AntDesign color={theme.txt} style={{ paddingHorizontal: 20, padding: 10 }} name="heart" size={20} color={theme.brand} />
                                <TouchableHighlight onPress={() => handleHeart(params.list)} style={{ width: 1000, padding: 10 }}>
                                    <Text style={[styles.heading, { fontWeight: 'bold' }]}>Liked</Text>
                                </TouchableHighlight>
                            </>
                        ) : (
                            <>
                                <AntDesign color={theme.txt} style={{ paddingHorizontal: 20, padding: 10 }} name="hearto" size={20} />
                                <TouchableHighlight onPress={() => handleHeart(params.list)} style={{ width: 1000, padding: 10 }}>
                                    <Text style={[styles.heading, { fontWeight: 'bold' }]}>Like</Text>
                                </TouchableHighlight>
                            </>
                        )}
                    </View>
                    <View style={styles.options}>
                        {params.remove ? (
                            <>
                                <Ionicons color={theme.txt} style={{ paddingHorizontal: 20, padding: 9 }} name="remove-circle-outline" size={25} />
                                <TouchableHighlight onPress={() => navigation.navigate('Add to Playlist', { list: params.list })} style={{ width: 1000, padding: 10 }}>
                                    <Text style={[styles.heading, { fontWeight: 'bold' }]}>Remove from Playlist</Text>
                                </TouchableHighlight>
                            </>
                        ) : (
                            <>
                                <MaterialIcons color={theme.txt} style={{ paddingHorizontal: 20, padding: 5 }} name="playlist-add" size={25} />
                                <TouchableHighlight onPress={() => navigation.navigate('Add to Playlist', { list: params.list })} style={{ width: 1000, padding: 9 }}>
                                    <Text style={[styles.heading, { fontWeight: 'bold' }]}>Add to Playlist</Text>
                                </TouchableHighlight>
                            </>
                        )}
                    </View>
                    <View style={[styles.options, { paddingBottom: 15 }]}>
                        <Ionicons color={theme.txt} style={{ paddingHorizontal: 20, padding: 10 }} name="person-outline" size={20} />
                        <TouchableHighlight onPress={() => console.log('hey')} style={{ width: 1000, padding: 10 }}>
                            <Text style={[styles.heading, { fontWeight: 'bold' }]}>View Artist</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </>
    )
}

const styles = StyleSheet.create({
    heading: {
        color: theme.txt,
        fontSize: 18,
        padding: 10
    },
    options: {
        maxWidth: 500,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
    }
})
