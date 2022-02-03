import React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import theme from '../../theme/theme'
import VideoRenderer from './VideoRenderer'

export default function Singles({ data, index, title }) {
    return (
        <View style={{ paddingHorizontal: 15, paddingTop: 20 }} key={`SiNGLE_ARTIST_SCREEN${index}`}>
            <Text style={style.heading}>{title}</Text>

            <FlatList
                data={data}
                horizontal
                renderItem={({ item }) => (
                    <VideoRenderer
                        album={item}
                        width={250}
                        imageStyle={{
                            borderRadius: 8,
                            aspectRatio: 16 / 9,
                        }}
                    />
                )}
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