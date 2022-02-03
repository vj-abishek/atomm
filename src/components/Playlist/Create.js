import { useNavigation } from '@react-navigation/native'
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import theme from '../../theme/theme'
import { MMKV } from '../../storage/index';

export default function Create() {
    const [text, setText] = useState('');
    const input = useRef();

    const navigation = useNavigation();

    const handleText = (e) => {
        setText(e)
    }

    const clear = () => {
        MMKV.setArray('playlist', [])
        MMKV.setArray('newPlaylist', [])
    }

    const setPlaylist = () => {
        const playlist = MMKV.getMap('playlist');
        const colors = ['#476C9B', '#468C98', '#101419', '#984447']

        const color = colors[Math.floor(Math.random() * colors.length)]

        const id = nanoid()

        let length = 0;
        let playlistValue = null

        if (playlist?.length) {
            length = playlist.length

            playlist.push({
                name: text,
                id,
                color
            })
            playlistValue = playlist
        } else {
            playlistValue = [{
                name: text,
                id,
                color
            }]
        }

        MMKV.setArray('playlist', playlistValue)

        // set new playlist
        const oldPlaylists = MMKV.getArray('newPlaylist');

        const obj = {
            name: length,
            items: [],
            id
        }

        let value = null

        if (oldPlaylists?.length) {
            oldPlaylists.push(obj)
            value = oldPlaylists
        } else {
            value = [obj]
        }

        MMKV.setArray('newPlaylist', value)

        navigation.navigate('YourAlbum', {
            title: text,
            obj: {
                type: 'YourAlbum',
                name: obj.name,
                subtitle: [{ text: 'Your playlist' }],
                color
            }
        })

    }

    const handleCreate = () => {
        // clear()
        if (text === 'c') {
            clear()
        } else {
            setPlaylist()
        }

        console.log(MMKV.getArray('newPlaylist'), MMKV.getMap('playlist'))
    }

    useEffect(() => {
        input.current.focus();
    }, [])

    return (
        <SafeAreaProvider>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: theme.txt, fontWeight: 'bold', fontSize: 18 }}>Give your playlist a name.</Text>
                <TextInput onSubmitEditing={handleCreate} maxLength={30} ref={input} style={style.input} onChangeText={handleText} value={text} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '50%' }}>
                    <TouchableHighlight onPress={() => navigation.goBack()}>
                        <Text style={{ color: theme.txtSy }}>CANCEL</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={handleCreate}>
                        <Text style={{ color: text.trim() === '' ? theme.txtSy : '#1DB954' }}>CREATE</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </SafeAreaProvider>
    )
}


const style = StyleSheet.create({
    input: {
        height: 60,
        margin: 12,
        padding: 10,
        fontSize: 30,
        color: theme.txt
    },
})