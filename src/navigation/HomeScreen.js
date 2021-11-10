import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native'
import theme from '../theme/theme'
import HomeFeed from '../components/Feed/HomeFeed'
import { REACT_APP_API_URL } from '../../globals'

const url = REACT_APP_API_URL

export default function HomeScreen({ navigation }) {
    const [homeFeedData, setHomeFeedData] = useState(null)
    const [retry, setRetry] = useState(null)
    const [clicked, setClicked] = useState(false)

    const getHomePageData = async (token) => {
        try {
            const result = await axios({
                method: 'GET',
                url: `${url}trending.json?q=browse`,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                cancelToken: token
            })
            if (result.status === 200) {
                const parsedData = []
                result.data.forEach((singleHomeData) => {
                    if (!singleHomeData.header.title.includes('Moods')) {
                        let sectionData = {}
                        sectionData.title = singleHomeData.header.title
                        sectionData.data = singleHomeData.results
                        sectionData.browseId = singleHomeData.header.browseId
                        sectionData.data.map((result, i) => result.id = `${sectionData.browseId}_${i}_`)
                        parsedData.push(sectionData)
                    }
                })
                setHomeFeedData(parsedData)
                setClicked(false)
            }
        } catch (err) {
            console.log('shit', err)
            setClicked(true)
        }
    }

    useEffect(() => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        if (retry || retry === null) {
            getHomePageData(source.token)
        }

        return () => {
            source.cancel("axios request cancelled");
        }
    }, [retry])

    return (
        <View style={styles.container}>
            {homeFeedData ? (
                <HomeFeed data={homeFeedData} navigation={navigation} />
            ) : (
                clicked ? (
                    <View style={styles.loading}>
                        <Text style={{color: theme.txtSy}}>Something went wrong. Please try again.</Text>
                        <TouchableOpacity style={{ backgroundColor: theme.sy, marginTop: 20 }} onPress={() => { setRetry(true); setClicked(false) }}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" />
                    </View>
                )

            )
            }
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    retryText: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    }
})