import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import LottieView from 'lottie-react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { MMKV } from '../../storage';
import { ToastAndroid, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import theme from '../../theme/theme';


export default function Like({ route }) {

    const [playlist,] = useMMKVStorage('playlist', MMKV, [])
    const [album,] = useMMKVStorage('heartAlbum', MMKV, [])
    const [liked, isLiked] = useState(false)


    useEffect(() => {
        const isAlbum = route.params.obj.type === 'playlist' && playlist.some((al) => al.browseId === route.params.obj.browseId)
        const isPlaylist = route.params.obj.type === 'Album' && album.some((al) => al.browseId === route.params.obj.browseId)


        if (isAlbum || isPlaylist) {
            isLiked(true)
        }

    }, [playlist, route])

    const handleHeart = (item) => {

        const isPlaylist = item?.params?.obj?.type === 'playlist'

        const db = isPlaylist ? 'playlist' : 'heartAlbum'

        const oldHearts = MMKV.getArray(db)

        const value = {
            ...item.params.obj,
            title: item.params.title
        }

        isLiked(true)

        if (oldHearts && oldHearts?.length) {
            const alreadyPresent = oldHearts?.some((al) => al.browseId === item.params.obj.browseId)

            if (alreadyPresent) {
                oldHearts?.forEach((al, i) => {
                    if (al.browseId === item.params.obj.browseId) {
                        oldHearts.splice(i, 1)
                        return
                    }
                })

                MMKV.setArray(db, oldHearts)

                isLiked(false)

                ToastAndroid.show('Removed from your favorites', ToastAndroid.SHORT)
                return
            }

            // lottieFile.current.play()
            ToastAndroid.show('Added to your favorites', ToastAndroid.SHORT)

            oldHearts.push(value)
            MMKV.setArray(db, oldHearts)
            return
        }

        // lottieFile.current.play()

        ToastAndroid.show('Added to your favorites', ToastAndroid.SHORT)
        // isLiked(true)

        MMKV.setArray(db, [value])
    }



    return (
        <TouchableWithoutFeedback onPress={() => handleHeart(route)}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {liked ? (
                    <>
                        <LottieView autoPlay loop={false} speed={1.4} source={require('../../assets/twitter-heart.json')} style={style.lottie} />
                        <AntDesign name="hearto" size={20} color={theme.brand} />
                    </>
                ) : (
                    <AntDesign color={theme.txt} name="hearto" size={20} />
                )}
            </View>
        </TouchableWithoutFeedback>
    )
}

const style = StyleSheet.create({
    lottie: { width: 50, height: 50, position: 'absolute', top: -8, right: -7.5 }
})