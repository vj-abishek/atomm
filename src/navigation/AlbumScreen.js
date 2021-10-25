import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import AlbumList from '../components/Album/AlbumList';
import Header from '../components/Album/Header';
import theme from '../theme/theme'

const url = 'https://beatbump.ml/api/api.json'

export default function AlbumScreen({ route }) {
    const { obj, title } = route.params
    const [albumList, setAlbumList] = useState(null)

    const getAlbumData =async (token) => {
        try {
            const result = await axios({
                url,
                method: 'POST',
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                data: `path=browse&endpoint=browse&browseId=${obj.browseId}&type=release`,
                cancelToken: token
            })

            if(result.status === 200) {
                setAlbumList(result.data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].musicShelfRenderer.contents)
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
    }, [])

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
                renderItem={({ item }) => <AlbumList list={item.musicResponsiveListItemRenderer} obj={obj}/>}
                ListHeaderComponent={() => <Header obj={obj} title={title}/>}
               />
               </>
           ) : (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
