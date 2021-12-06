import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import theme from '../../theme/theme'
import VideoRenderer from './VideoRenderer'

export default function Albums({ data, index, showTitle = true, title, width, radius = 8, top = 20 }) {
    return (
        <View style={{ paddingHorizontal: 15, paddingTop: top}} key={`ALBUM_ARTIST_SCREEN${index}`}>
            {showTitle && <Text style={style.heading}>{title}</Text>}

            <FlatList
                data={data}
                horizontal
                initialNumToRender={2}
                renderItem={({ item }) => <VideoRenderer album={item} width={width} imageStyle={{ width, height: width, borderRadius: radius }} />}
                showsHorizontalScrollIndicator={false}
            />

        </View>
    )
}

const style = StyleSheet.create({
    heading: {
        fontSize: 22,
        color: theme.txt,
        fontWeight: 'bold',
        paddingBottom: 15
    },
    text: {
        fontSize: 15,
        color: theme.txt,
        paddingBottom: 10
    }
})

