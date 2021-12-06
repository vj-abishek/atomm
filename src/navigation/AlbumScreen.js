import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native'
import AlbumList from '../components/Album/AlbumList';
import Header from '../components/Album/Header';
import theme from '../theme/theme'
import { REACT_APP_API_URL } from '../../globals'

const url = `${REACT_APP_API_URL}api/`

export default function AlbumScreen({ route }) {
    const { obj, title } = route.params
    const [albumList, setAlbumList] = useState(null)

    const getAlbumData = async (token) => {
        const data = obj?.type === 'playlist' ? `path=playlist&endpoint=browse&type=playlist&browseId=${obj.browseId}&playlistId=${obj.browseId}` : `path=browse&endpoint=browse&browseId=${obj.browseId}&type=release`

        try {
            const result = await axios({
                url: `${url}api.json`,
                method: 'POST',
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                data,
                cancelToken: token
            })

            if (result.status === 200) {
                if (result.data?.tracks) {
                    setAlbumList(result.data.tracks)
                } else {
                    setAlbumList(result?.data?.contents?.singleColumnBrowseResultsRenderer?.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].musicShelfRenderer.contents)
                }
            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        getAlbumData(source.token)

        return () => {
            source.cancel("axios request cancelled");
        }
    }, [route])

    return route?.params?.obj && (
        <View style={styles.container}>
            {albumList ? (
                <>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    </View>
                    <FlatList
                        data={albumList}
                        renderItem={({ item, index }) => <AlbumList i={index} list={item?.videoId ? item : item.musicResponsiveListItemRenderer} obj={obj} />}
                        ListHeaderComponent={() => <Header obj={obj} title={title} albumList={albumList}/>}
                    />
                </>
            ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        color: theme.txt,
        backgroundColor: theme.bg,
        flex: 1,
        paddingBottom: 10
    }
})
