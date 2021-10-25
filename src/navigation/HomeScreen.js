import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {View, StyleSheet, ActivityIndicator} from 'react-native'
import theme from '../theme/theme'
import HomeFeed from '../components/Feed/HomeFeed'

const URL = 'https://beatbump.ml/trending.json?q=browse'



export default function HomeScreen({navigation}) {
    const [homeFeedData, setHomeFeedData] = useState(null)

    const getHomePageData = async (token) => {
       try {
        const result = await axios({
            method: 'GET',
            url: URL,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            cancelToken: token
        })
            if(result.status === 200) {
                const parsedData = []
                result.data.forEach((singleHomeData) => {
                    if(!singleHomeData.header.title.includes('Moods')) {
                        let sectionData = {}
                        sectionData.title = singleHomeData.header.title
                        sectionData.data = singleHomeData.results
                        sectionData.browseId = singleHomeData.header.browseId
                        sectionData.data.map((result, i) => result.id = `${sectionData.browseId}_${i}_`)
                        parsedData.push(sectionData)
                    }
                })
                setHomeFeedData(parsedData)
            }
       } catch (err) {
           console.log(err)
       }
    }

    useEffect(() => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        getHomePageData(source.token)

        return () => {
            source.cancel("axios request cancelled");
        }
    },[])

    return (
            <View style={styles.container}>
                {homeFeedData ? (
                    <HomeFeed data={homeFeedData} navigation={navigation} />
                ): (
                <View style={styles.loading}>
                        <ActivityIndicator size="large" />
                </View>
                )}
            </View>
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
    }
})