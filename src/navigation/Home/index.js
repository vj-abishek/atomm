import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import theme from '../../theme/theme';
import Feed from './Feed';
import { getHome } from '../../api/home';

export default function index() {

    const [homeFeedData, setHomeFeedData] = useState(null)
    const [retry, setRetry] = useState(null)
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        if (retry || retry === null) {

            try {
                getHome('FEmusic_home', null, source.token).then(data => {
                    setHomeFeedData(data)
                    setClicked(false)
                })
            } catch (err) {
                console.log(err)
                setClicked(true)
            }
        }

        return () => {
            source.cancel("axios request cancelled");
        }
    }, [retry])

    return (
        <View style={styles.container}>
            {homeFeedData ? (
                <Feed data={homeFeedData}/>
            ) : (
                clicked ? (
                    <View style={styles.loading}>
                        <Text style={{ color: theme.txtSy }}>Something went wrong. Please try again.</Text>
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
    },
    retryText: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    }
})
