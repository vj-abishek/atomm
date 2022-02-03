import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SectionList, StatusBar, StyleSheet, TouchableHighlight, View } from 'react-native';
import Animated, { Extrapolate, interpolate, interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getArtistDetails } from '../api/artist';
import About from '../components/Artist/About';
import Albums from '../components/Artist/Albums';
import Header from '../components/Artist/Header';
import Songs from '../components/Artist/Songs';
import Video from '../components/Artist/Video';
import theme from '../theme/theme';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;

export default function ArtistScreen({ route, navigation }) {
    const { browseId } = route.params;
    const [sectionData, setSectionData] = useState(null);

    const yOffset = useSharedValue(0);


    const animatedOpacity = useAnimatedStyle(() => {
        const headerOpacity = interpolate(yOffset.value,
            [0, 100, 250],
            [0, 0, 1],
            { extrapolateRight: Extrapolate.CLAMP, extrapolateLeft: Extrapolate.CLAMP }
        );

        return {
            opacity: headerOpacity,
        }
    })

    const animatedBackground = useAnimatedStyle(() => {
        const headerBackground = interpolateColor(yOffset.value, [0, 150], ['transparent', theme.bg]);

        return {
            backgroundColor: headerBackground,
        }
    })


    useEffect(() => {
        const getArtist = async () => {
            const response = await getArtistDetails(browseId);
            setSectionData(response);
        }
        getArtist();
    }, [browseId])

    const scrollHander = useAnimatedScrollHandler((e) => {
        yOffset.value = e.contentOffset.y
    });

    return sectionData ? (
        <>
            <StatusBar
                translucent
                backgroundColor="rgba(12,15,18,0.98)"
                barStyle="light-content"
            />

            <View style={styles.container}>
                <Animated.View style={[styles.header, { top: STATUS_BAR_HEIGHT }, animatedBackground]}>
                    <TouchableHighlight onPress={() => navigation.goBack()}>
                        <AntDesign size={25} style={{ paddingLeft: 15, color: theme.txt }} name='arrowleft'></AntDesign>
                    </TouchableHighlight>
                    {sectionData[0].data[0].title && (
                        <Animated.Text numberOfLines={1} style={[{ color: theme.txt, fontWeight: 'bold', fontSize: 20, paddingLeft: 20, paddingRight: 10 }, animatedOpacity]}>{sectionData[0].data[0].title}</Animated.Text>
                    )}
                </Animated.View>
                <AnimatedSectionList
                    onScroll={scrollHander}
                    scrollEventThrottle={16}
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
    },
    header: {
        flex: 1,
        zIndex: 4,
        height: 60,
        ...StyleSheet.absoluteFillObject,
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
        // elevation: 4,
    }
})

