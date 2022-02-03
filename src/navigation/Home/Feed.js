import React, { useEffect, useRef, useState } from 'react'
import { View, SectionList, ActivityIndicator, StatusBar } from 'react-native'
import Header from './Header'
import Video from '../../components/Artist/Video'
import Albums from '../../components/Artist/Albums'
import { getHome } from '../../api/home'
import axios from 'axios'
import { useScrollToTop } from '@react-navigation/native'

export default function Feed({ data }) {
    const [currentData, setCurrentData] = useState(data);
    const [isLoading, setisLoading] = useState(true)
    const [end, setEnd] = useState(false)
    const [isRefreshing, setisRefreshing] = useState(false)

    const ref = useRef(null);

    useScrollToTop(ref);

    const handleEnd = () => {
        if (end) return;

        setisLoading(true)
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        getHome('FEmusic_home', true, source.token).then(newData => {
            if (newData[0]?.title === 'End') {
                setEnd(true)
                setisLoading(false)
                return;
            }
            setCurrentData((oldData) => [...oldData, ...newData])
            setisLoading(false)
        })
    }

    const handleRefresh = () => {
        setisRefreshing(true)
        setEnd(false)

        getHome('FEmusic_home', false, null, true).then(newData => {
            setCurrentData(newData)
            setisRefreshing(false)
        })
    }

    useEffect(() => {
        let timer = null
        if (isLoading) {
            timer = setTimeout(() => setisLoading(false), 10000)
        }

        // clear timeout
        return () => {
            clearTimeout(timer)
        }
    }, [isLoading])

    return (
        <>
            <StatusBar
                translucent
                backgroundColor="rgba(0,0,0,0.4)"
                barStyle="light-content"
            />
            <View style={{ flex: 1 }}>
                {currentData && <SectionList
                    ref={ref}
                    scrollEventThrottle={16}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    sections={currentData}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    initialNumToRender={3}
                    onRefresh={handleRefresh}
                    refreshing={isRefreshing}
                    onEndReached={handleEnd}

                    renderSectionHeader={({ section, index }) => {
                        if (section?.title === 'End') return null;

                        if (section?.type === 'musicBackground')
                            return (
                                <View style={{ paddingBottom: 20 }}>
                                    <Header data={section} index={index} />
                                </View>
                            )

                        if (section?.type === 'album')
                            return (
                                <View style={section.isFirst ? { paddingTop: 60 } : {}}>
                                    <Albums top={10} title={section?.title} width={150} data={section.data} index={index} />
                                </View>
                            )


                        if (section?.type === 'video')
                            return (
                                <View style={section.isFirst ? { paddingTop: 60 } : {}}>
                                    <Video title={section?.title} data={section.data} index={index} />
                                </View>
                            )

                        return null

                    }}

                    ListFooterComponent={() => (
                        isLoading && <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, height: 100 }}>
                            <ActivityIndicator size="small" />
                        </View>
                    )}
                    renderItem={({ item, section }) => {
                        return null;
                    }}
                />}
            </View>
        </>
    )
}
