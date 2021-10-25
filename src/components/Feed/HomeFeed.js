import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, SectionList, FlatList, StatusBar } from 'react-native'
import theme from '../../theme/theme';
import ListItem from './ListItem';

export default function HomeFeed({ data, navigation }) {
    return (
        <>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
          />
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <SectionList
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    stickySectionHeadersEnabled={false}
                    sections={data}
                    renderSectionHeader={({ section }) => (
                        <>
                            {section && 'title' in section && 'data' in section && (
                                <>
                                    <Text style={styles.Title}>{section.title}</Text>
                                    <FlatList
                                        horizontal
                                        data={section?.data}
                                        initialNumToRender={2}
                                        renderItem={({ item }) => <ListItem item={item} navigation={navigation} section={section} />}
                                        showsHorizontalScrollIndicator={false}
                                    />
                                </>
                            )}
                        </>
                    )}
                    renderItem={({ item, section }) => {
                        return null;
                    }}
                />
            </SafeAreaView>
        </View>
    </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight + 20
    },
    Title: {
        fontSize: 25,
        color: theme.txt,
        fontWeight: 'bold',
        margin: 10
    }

})
