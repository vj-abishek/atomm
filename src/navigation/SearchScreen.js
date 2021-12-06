import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, StatusBar, ActivityIndicator, FlatList, Text, Keyboard, ScrollView } from 'react-native'
import { SearchBar } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import Feed from '../components/Search/Feed'
import Result from '../components/Search/Result'
import theme from '../theme/theme'
import { searchJson } from '../utils/searchContent'
import { REACT_APP_API_URL } from '../../globals'
import { setFocusSearch } from '../store/features/playerSlice'
import { MMKV } from '../storage/index';
import { useScrollToTop } from '@react-navigation/native'

const url = `${REACT_APP_API_URL}api/`

export default function SearchScreen({ navigation }) {
    const [search, setSearch] = useState({ search: '' });
    const [searchResult, setSearchResult] = useState(null)
    const [blur, setBlur] = useState(false)
    const [loading, setLoading] = useState(false)
    const [cache, setCache] = useState([])
    const [searchData, setSearchData] = useState(null)

    const FlatListRef = useRef(null);

    useScrollToTop(FlatListRef);


    const { search: searchTerm } = useSelector(state => state.search)
    const { focusSearch } = useSelector(state => state.player)
    const dispatch = useDispatch()
    const ref = useRef(null)

    const getSearchResults = async (sTearm = null) => {
        const searchTearm = sTearm ? sTearm : searchTerm

        setSearch({ search: searchTearm })

        const result = await searchJson(searchTearm)
        const data = result.content
        if (data) {
            setSearchData(data)
            setLoading(false)

            let oS = MMKV.getMap('suggestions')
            if (oS?.length > 0) {
                if (oS.length > 50)
                    oS.length = 50

                oS.forEach((item, i) => {
                    if (item.query === searchTearm) {
                        oS.splice(i, 1)
                        return;
                    }
                })

                const newSuggestions = [{ query: searchTearm }, ...oS]
                MMKV.setMap('suggestions', newSuggestions)
            } else {
                MMKV.setMap('suggestions', [{ query: searchTearm }])
            }

        }
    }

    useEffect(() => {
        if (focusSearch.isFocus) {
            ref.current.focus()
        } else {
            Keyboard.dismiss()
        }
    }, [focusSearch])

    useEffect(() => {
        const blur = navigation.addListener('blur', () => {
            dispatch(setFocusSearch({
                focusSearch: {
                    isFocus: false,
                    count: 0
                }
            }))
        })

        const focus = navigation.addListener('focus', () => {
            dispatch(setFocusSearch({
                focusSearch: {
                    isFocus: false,
                    count: 1
                }
            }))
        })

        return () => {
            blur();
            focus();
        };
    }, [navigation])

    useEffect(() => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        const fetchResult = async () => {
            if (search.search.length > 0) {
                try {
                    const result = await axios({
                        url: `${url}get_search_suggestions.json?q=${search.search}`,
                        method: 'GET',
                        cancelToken: source.token
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
        }

        fetchResult();

        // return () => {
        //     source.cancel("axios request cancelled");
        // }
    }, [search])

    useEffect(() => {
        if (searchTerm) {
            setLoading(true)
            getSearchResults()
        }
    }, [searchTerm])

    const handleFocus = () => {
        setBlur(() => false)

        const suggestions = MMKV.getMap('suggestions')
        if (suggestions) {
            setCache(suggestions)
        }
    }

    return (
        <View style={styles.container}>
            <View
                style={styles.search}
            >
                <SearchBar
                    placeholder='Songs, Artists or playlist'
                    onChangeText={(search) => setSearch({ search })}
                    value={search.search}
                    round={true}
                    ref={ref}
                    onSubmitEditing={() => { setLoading(true); getSearchResults(search.search) }}
                    onBlur={() => { ref?.current?.blur(); setBlur(true) }}
                    onFocus={handleFocus}
                    inputStyle={{
                        backgroundColor: theme.sy
                    }}
                    inputContainerStyle={{
                        backgroundColor: theme.sy
                    }}
                    onClear={() => {
                        setSearch({ search: '' })
                        setSearchResult(null)
                        setSearchData(null)
                        setLoading(false)
                    }}
                />

                {(searchResult && !blur) && searchResult.map((searchRs) => <Result ref={ref} search={searchRs} key={`searchSuggestion_MaIn_${Date.now()}_${searchRs.id}`} />)}

                {(!searchResult && !blur && cache) && (
                    <ScrollView keyboardShouldPersistTaps='always'>
                        {cache?.map((searchRs) => <Result ref={ref} suggestions={true} search={searchRs} key={`CACHE_searchSuggestion_MaIn_${Date.now()}_${Math.random()}`} />)}
                    </ScrollView>
                )}

            </View>

            {(loading) ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                searchData ? (
                    <FlatList
                        ref={FlatListRef}
                        data={searchData}
                        renderItem={({ item }) => <Feed searchData={item} navigation={navigation} />}
                    />
                ) : (

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: theme.txt, fontSize: 20 }}>Play what you love</Text>
                        <Text style={{ color: theme.txtSy, fontSize: 14, marginTop: 5 }}>Search for songs, playlist and artist</Text>
                    </View>

                )
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
