import React from 'react'
import { MMKV } from '../../../storage/index'
import { View, Text, FlatList } from 'react-native'
import { useMMKVStorage } from 'react-native-mmkv-storage'
import APrenderer from '../../../components/Helpers/APrenderer'
import theme from '../../../theme/theme'

export default function Album({ navigation }) {

    const [album,] = useMMKVStorage('heartAlbum', MMKV, [])

    return (
        album.length > 0 ? (
            <FlatList
                data={album}
                renderItem={({ item }) => <APrenderer item={item} from="album" navigation={navigation} />}
            />
        ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.txt, fontSize: 20 }}>Place for your favorite albums</Text>
            </View>
        )
    )
}
