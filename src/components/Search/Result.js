import React, { forwardRef } from 'react'
import { View, Text, StyleSheet,  TouchableOpacity } from 'react-native'
import SearchIcon from 'react-native-vector-icons/AntDesign'
import { useDispatch } from 'react-redux'
import { setSearch } from '../../store/features/searchSlice'
import theme from '../../theme/theme'

const Result =  forwardRef(({ search }, ref) => {

    const dispatch = useDispatch()

    const handlePress = () => {
        ref?.current.blur()
        dispatch(setSearch({
            search: search.query
        }))
    }

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.container}>
                <View style={styles.searchSuggestion}>
                    <SearchIcon style={styles.icon} name="search1" size={16} color={theme.txt}/>
                    <Text style={{flex: 1, color: theme.txtSy}}>{search.query}</Text>
                </View>
            </View>
        </TouchableOpacity>

    )
})

export default Result;

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

