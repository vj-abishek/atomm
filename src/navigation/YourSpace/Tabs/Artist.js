import React from 'react'
import { View, Text } from 'react-native'
import theme from '../../../theme/theme'

export default function Artist() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.txt, fontSize: 20 }}>Space for your favorite artists</Text>
        </View>
    )
}
