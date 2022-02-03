import React from 'react'
import { View, StyleSheet } from 'react-native'

import Dropdown from './Helpers/DropDown'

export default function Settings() {
    return (
        <View style={styles.container}>
            <Dropdown data={[{
                label: 'Low',
                value: 'AUDIO_QUALITY_LOW'
            }, {
                label: 'Medium',
                value: 'AUDIO_QUALITY_MEDIUM'
            }]}
                label="Audio Quality"
                name="audiotrack"
            />

            <Dropdown data={[{
                label: 'Low',
                value: 'AUDIO_QUALITY_LOW'
            }, {
                label: 'Medium',
                value: 'AUDIO_QUALITY_MEDIUM'
            }]}
                label="Download Quality"
                name="file-download"
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginTop: 20,
    }
})