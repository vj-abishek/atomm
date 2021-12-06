import React, { useEffect, useRef, useState } from 'react'
import { SectionList, StatusBar } from 'react-native';
import { View, StyleSheet, ActivityIndicator, Animated } from 'react-native'
import { getArtistDetails } from '../api/artist';
import Albums from '../components/Artist/Albums';
import Header from '../components/Artist/Header';
import Songs from '../components/Artist/Songs';
import Video from '../components/Artist/Video'
import About from '../components/Artist/About'
import theme from '../theme/theme'

export default function ArtistScreen({ route, navigation }) {
    const { browseId } = route.params;
    const [sectionData, setSectionData] = useState(null);

    const yOffset = useRef(new Animated.Value(0)).current;
    const headerOpacity = yOffset.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    useEffect(() => {
        const getArtist = async () => {
            const response = await getArtistDetails(browseId);
            setSectionData(response);
        }
        getArtist();
    }, [browseId])

    useEffect(() => {
        navigation.setOptions({
            headerStyle: {
                opacity: headerOpacity,
            },
            headerBackground: () => (
                <Animated.View
                    style={{
                        backgroundColor: "white",
                        ...StyleSheet.absoluteFillObject,
                        opacity: headerOpacity,
                    }}
                />
            ),
            headerTransparent: true,
        });
        console.log(headerOpacity)
    }, [headerOpacity, navigation]);

    return sectionData ? (
        <>
            <StatusBar
                translucent
                backgroundColor="rgba(0,0,0,0.4)"
                barStyle="light-content"
            />
            <View style={styles.container}>
                <Animated.SectionList
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        y: yOffset,
                                    },
                                },
                            },
                        ],
                        { useNativeDriver: true }
                    )}
                    stickySectionHeadersEnabled={false}
                    sections={sectionData}
                    showsVerticalScrollIndicator={false}
                    renderSectionHeader={({ section, index }) => {
                        if (section.title === 'header')
                            return <Header data={section.data} />

                        if (section.type === 'songs')
                            return <Songs data={section.data} index={index} />

                        if (section.title.includes('Albums'))
                            return <Albums title='Albums' data={section.data} width={200} index={index} />

                        if (section.title.includes('Singles'))
                            return <Albums title='Singles' width={150} data={section.data} index={index} />

                        if (section.title.includes('Videos'))
                            return <Video title='Videos' data={section.data} index={index} />

                        if (section.title.includes('Featured'))
                            return <Albums title='Featured on' width={150} data={section.data} index={index} />

                        if (section.title.includes('might'))
                            return <Albums title='Fans might also like' width={150} radius={100} data={section.data} index={index} />

                        if (section.title.includes('About'))
                            return <About title='About' data={section.data[0]} index={index} />


                        return null
                    }}
                    renderItem={({ item, section }) => {
                        return null;
                    }}
                />
            </View>
        </>
    ) : (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={theme.txt} />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg
    }
})

