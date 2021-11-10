import React, { useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableNativeFeedback } from 'react-native'
import { Image } from 'react-native-elements'
import { useSelector } from 'react-redux'
import { PlaySong } from '../../utils/play'
import theme from '../../theme/theme'


const Playlist = ({ item, index, playerStatus, vibrant, bottomPlayerStatus }) => {
    const [cIndex, setcIndex] = useState(null)

    const handlePress = async () => {
        setcIndex(index)
        await PlaySong(index, item.videoId, item.thumbnail)
    }

    return (
        <TouchableNativeFeedback key={`PlAyLiSt_INDEX_BOTTOM_ScREEN${index}`} onPress={handlePress}>
            <View style={[styles.item, playerStatus.cpIndex === index ? { backgroundColor: theme.sy } : {}]}>
                <View style={{ flexDirection: 'row', flex: 2, alignItems: 'center' }}>
                    <View>
                        <Image
                            source={{ uri: item.thumbnail }}
                            resizeMode="cover"
                            PlaceholderContent={<ActivityIndicator size="small" color={theme.txt} />}
                            style={styles.image} />
                        {cIndex === index && bottomPlayerStatus.isLoading ? (
                            <View style={[styles.image, styles.position]}>
                                <ActivityIndicator size="small" color={theme.txt} />
                            </View>
                        ) : null}
                    </View>

                    <View style={{ marginLeft: 15, flex: 1, marginRight: 10 }}>
                        <Text numberOfLines={2} style={styles.text}>{item.title}</Text>
                        <Text numberOfLines={2} style={styles.subtitle}>{item.artistInfo.artist}</Text>
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
        paddingTop: 30,
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
        width: 50,
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