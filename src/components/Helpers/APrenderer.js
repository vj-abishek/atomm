import React from 'react'
import { View, Text, TouchableNativeFeedback } from 'react-native'
import FastImage from 'react-native-fast-image'
import theme from '../../theme/theme'

export default function APrenderer({ item, navigation, from }) {

    const handlePlaylist = (itm) => {
        let obj = {}
        obj.browseId = itm.browseId
        obj.thumbnails = itm.thumbnails
        obj.subtitle = itm.subtitle
        obj.playlistId = itm.browseId
        obj.type = from === 'playlist' ? 'playlist' : 'Album';

        const route = 'YourAlbum'

        navigation.navigate(route,
            {
                title: itm.title,
                obj,
            })

        return
    }


    return (
        <TouchableNativeFeedback onPress={() => handlePlaylist(item)}>
            <View style={{ paddingHorizontal: 15, flex: 1, flexDirection: 'row', paddingVertical: 8 }}>
                <FastImage source={{
                    uri: item.thumbnails,
                }}
                    style={{ width: 65, height: 65 }}
                />
                <View style={{ paddingLeft: 15, justifyContent: 'center', paddingRight: 25 }}>
                    <Text numberOfLines={1} style={{ color: theme.txt, fontSize: 18 }}>{item.title}</Text>
                    <View>
                        {item?.subtitle ? (
                            <Text style={{ color: theme.txtSy, paddingRight: 25 }} numberOfLines={1}>
                                {item.subtitle.map((itm, i) => (
                                    <Text key={`${i}_SUBTITLE_YOUR_PLAYLIST_ALBUM_${from}`} numberOfLines={1}>{itm.text}</Text>
                                ))}
                            </Text>
                        ) : (
                            <Text style={{ color: theme.txtSy, }}>Playlist</Text>
                        )}
                    </View>

                </View>
            </View>
        </TouchableNativeFeedback>
    )
}
