import React, { useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableNativeFeedback } from 'react-native'
import { useSelector } from 'react-redux'
import { PlaySong } from '../../utils/play'
import theme from '../../theme/theme'

// find if a element is array
const isArray = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Array]'
}

const Playlist = ({ item, index, playerStatus, vibrant, bottomPlayerStatus }) => {
    const [cIndex, setcIndex] = useState(null)

    const handlePress = async () => {
        setcIndex(index)

        if (item?.isOffline) {
            await PlaySong(index, item.videoId, item.thumbnail, null, item)
        } else {
            await PlaySong(index, item.videoId, item.thumbnail)
        }

        setcIndex(null)
    }

    return (
        <TouchableNativeFeedback key={`PlAyLiSt_INDEX_BOTTOM_ScREEN${index}`} onPress={handlePress}>
            <View style={[styles.item, playerStatus.cpIndex === index ? { backgroundColor: theme.sy } : {}]}>
                <View style={{ flexDirection: 'row', flex: 2, alignItems: 'center' }}>
                    <View>
                        <View style={styles.image} />
                        {cIndex === index && bottomPlayerStatus.isLoading ? (
                            <View style={[styles.image, styles.position]}>
                                <ActivityIndicator size="small" color={theme.txt} />
                            </View>
                        ) : null}
                    </View>

                    <View style={{ marginLeft: 15, flex: 1, marginRight: 10 }}>
                        <Text numberOfLines={2} style={styles.text}>{item.title}</Text>
                        {item?.artist && (
                            <Text style={styles.subtitle} numberOfLines={2}>{item?.artist}</Text>
                        )}
                        {isArray(item?.artistInfo?.artist) && (<Text style={styles.subtitle} numberOfLines={2}>{item?.artistInfo?.artist[0]?.text}</Text>)}
                        {item?.artistInfo?.artist && (
                            <Text style={styles.subtitle} numberOfLines={2}>{item?.artistInfo?.artist}</Text>
                        )}
                    </View>
                </View>
                <View>
                    <Text style={[styles.subtitle]}>{item.length}</Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    )
}

export default function index() {

    const { playlist, playerStatus, vibrant, bottomPlayerStatus } = useSelector(state => state.player)

    return playlist ? (
        <View style={styles.container}>
            <FlatList
                data={playlist}
                renderItem={({ item, index }) => <Playlist item={item} index={index} playerStatus={playerStatus} vibrant={vibrant} bottomPlayerStatus={bottomPlayerStatus} />}
            />
        </View>
    ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg }}>
            <Text style={{ color: theme.txt, fontSize: 20 }}>Your Playlist is empty 💔</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: theme.bg,
        flex: 1
    },
    item: {
        padding: 10,
        width: '100%',
        flexDirection: 'row',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        color: theme.txt,
        fontSize: 16,
    },
    subtitle: {
        color: theme.txtSy,
    },
    image: {
        width: 35,
        height: 50,
        borderRadius: 8
    },
    position: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        backgroundColor: '#25252599'
    }
})