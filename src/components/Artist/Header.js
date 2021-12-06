import React from 'react'
import { View, Text, Dimensions, ImageBackground, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import theme from '../../theme/theme'


export default function Header({ data }) {
    const { height } = Dimensions.get('window')

    return (
        <View style={{ height: height / 2.6, position: 'relative' }}>
            <ImageBackground source={{
                uri: data[0].thumbnail
            }} resizeMode="cover" style={{ flex: 1 }} />
            <LinearGradient
                colors={['transparent', theme.transparentBlack]}
                locations={[0, 0.7]}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute'
                }}>
                <Text numberOfLines={2} style={style.text}>{data[0].title}</Text>
            </LinearGradient>
        </View>
    )
}

const style = StyleSheet.create({
    text: {
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
        fontSize: 45,
        color: theme.txt,
        fontWeight: 'bold',
        width: '70%',
        marginLeft: 15,
    }
})
