import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import theme from '../../theme/theme'

export default function Singles({ data, index, title }) {
    return (
        <View style={{ paddingHorizontal: 15, paddingTop: 20, paddingBottom: 10 }} key={`ABOUT_ARTIST_SCREEN${index}`}>
            <View style={{ paddingBottom: 15 }}>
                <Text style={style.heading}>{title}</Text>
                <Text style={{ color: theme.txtSy, fontSize: 15 }}>{data?.subHeader}</Text>
            </View>

            <Text style={{ color: theme.txtSy, fontSize: 15 }}>{data?.description}</Text>

        </View>
    )
}


const style = StyleSheet.create({
    heading: {
        fontSize: 22,
        color: theme.txt,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 15,
        color: theme.txt,
        paddingBottom: 10
    }
})