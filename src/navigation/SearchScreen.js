import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, StatusBar, ActivityIndicator, FlatList } from 'react-native'
import { SearchBar } from 'react-native-elements'
import { useSelector } from 'react-redux'
import Feed from '../components/Search/Feed'
import Result from '../components/Search/Result'
import theme from '../theme/theme'
import { searchJson } from '../utils/searchContent'
import { REACT_APP_API_URL } from '../../globals'

const url = `${REACT_APP_API_URL}api/`

export default function SearchScreen({ navigation }) {
    const [search, setSearch] = useState({ search: '' });
    const [searchResult, setSearchResult] = useState(null)
    const [blur, setBlur] = useState(false)
    const [loading, setLoading] = useState(false)
    const [searchData, setSearchData] = useState(null)

    const { search: searchTerm } = useSelector(state => state.search)
    const ref = useRef(null)

    async function updateSearch(search) {
        setSearch({ search })

        try {
            const result = await axios({
                url: `${url}get_search_suggestions.json?q=${search}`,
                method: 'GET'
            })

            if (result.status === 200) {
                const data = result.data
                if (data.length > 5) {
                    data.length = 5
                }
                setSearchResult(data)
            }

        } catch (err) {
            console.log(err)
        }
    }

    const getSearchResults = async (sTearm = null) => {
        const result = await searchJson(sTearm ? sTearm : searchTerm)
        const data = result.content
        if (data) {
            setSearchData(data)
            setLoading(false)
        }
    }

    useEffect(() => {
        ref.current.focus()
    }, [])

    useEffect(() => {
        if (searchTerm) {
            setLoading(true)
            getSearchResults()
        }
    }, [searchTerm])

    return (
        <View style={styles.container}>
            <View
                style={styles.search}
            >
                <SearchBar
                    placeholder='Songs, Artists or playlist'
                    onChangeText={updateSearch}
                    value={search.search}
                    round={true}
                    ref={ref}
                    onSubmitEditing={() => { setLoading(true); getSearchResults(search.search) }}
                    onBlur={() => setBlur(true)}
                    onFocus={() => setBlur(false)}
                    inputStyle={{
                        backgroundColor: theme.sy
                    }}
                    inputContainerStyle={{
                        backgroundColor: theme.sy
                    }}
                />

                {(searchResult && !blur) && searchResult.map((searchRs) => <Result ref={ref} search={searchRs} key={`searchSuggestion_MaIn_${Date.now()}_${searchRs.id}`} />)}

            </View>

            {(loading) ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={searchData}
                    renderItem={({ item }) => <Feed searchData={item} navigation={navigation} />}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
    },
    search: {
        marginTop: StatusBar.currentHeight
    }
})
