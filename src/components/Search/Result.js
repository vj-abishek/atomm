import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SearchIcon from 'react-native-vector-icons/AntDesign'
import theme from '../../theme/theme'

export default function Result({ search, key }) {
    return (
        <View style={styles.container} key={`searchSuggestion_MaIn_${key}`}>
            <View style={styles.searchSuggestion}>
                <SearchIcon style={styles.icon} name="search1" size={16} color={theme.txt}/>
                <Text style={{flex: 1}}>{search.query}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.bg,
        position: 'relative',
        zIndex: 2
    },
    searchSuggestion: {
        fontSize: 16,
        color: theme.txt,
        padding: 12,
        backgroundColor: theme.sy,
        flexDirection: 'row'
    },
    icon: {
        margin: 5,
        marginRight: 20,
    }
})

