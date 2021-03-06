import React from 'react'
import { View, Text, Dimensions, StyleSheet, StatusBar } from 'react-native'
import FastImage from 'react-native-fast-image'
import Albums from '../../components/Artist/Albums';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../../theme/theme';

const { height } = Dimensions.get('window')
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;


export default function Header({ data, index }) {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, minHeight: height / 2 }}>
                <FastImage
                    source={{
                        uri: data.backgroundImage,
                        resizeMode: FastImage.resizeMode.contain,
                    }}
                    style={{
                        flex: 1
                    }}
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.5)', theme.bg]}
                    style={styles.container}>
                    <View style={{ paddingTop: STATUS_BAR_HEIGHT + 50 }}>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ color: theme.txtHeader }}>{data.header.strapline}</Text>
                            <Text style={{ color: theme.txt, fontWeight: 'bold', fontSize: 22 }}>{data.header.title}</Text>
                        </View>
                        <Albums showTitle={false} width={150} data={data.data} index={index} />

                    </View>
                </LinearGradient>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    }
})

