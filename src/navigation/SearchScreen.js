import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { SearchBar  } from 'react-native-elements'
import Result from '../components/Search/Result'
import theme from '../theme/theme'

const url = 'https://beatbump.ml/api/'

export default function SearchScreen() {
    const [search, setSearch] = useState({search: ''});
    const [searchResult, setSearchResult] = useState(null)
    const ref = useRef(null)

    async function updateSearch(search) {
        setSearch({ search })

        try {
            const result = await axios({
                url: `${url}get_search_suggestions.json?q=${search}`,
                method: 'GET'
            })

            if(result.status === 200) {
                console.log(result.data)
                const data = result.data
                if(data.length > 6) {
                    data.length = 6
                }
                setSearchResult(data)
            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        ref.current.focus()
    }, [])

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
                inputStyle={{
                    backgroundColor: theme.sy
                }}
                inputContainerStyle={{
                    backgroundColor: theme.sy
                }}
                />

            {searchResult && searchResult.map((searchRs) => <Result search={searchRs} key={searchRs.id} />)}
          </View>

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
