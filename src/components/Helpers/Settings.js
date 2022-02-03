import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import theme from '../../theme/theme'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

export default function Settings() {

    const navigation = useNavigation()
    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="ios-settings-outline" size={23} color={theme.txtSy} />
        </TouchableWithoutFeedback>
    )
}
