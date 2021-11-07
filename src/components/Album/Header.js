import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import theme from '../../theme/theme'

export default function Header({obj, title}) {
    return (
        <View style={styles.headerContainer}>
        <Image
                source={{
                    uri: obj.thumbnails,
                }}
                style={styles.imageStyle}
                resizeMode="cover"
                PlaceholderContent={<ActivityIndicator size="small" color={theme.txt} />}
            />
            <Text style={styles.heading}>{title}</Text>
            <Text style={{marginTop: 3, textAlign: 'center'}}>
                    {obj.subtitle.map((st, i) => (
                        <Text key={`FroM_album_Main_subtitle_T${i}`}>{st.text}</Text>
                    ))}
            </Text>
            {/* <TouchableOpacity  onPress={() => dispatch(setRandomId({
                randomId: Date.now()
            }))} style={styles.playAll}>
                    <Text style={styles.appButtonText}>Play Now</Text>
            </TouchableOpacity > */}
       </View>
    )
}


const styles = StyleSheet.create({
    headerContainer: {
        marginTop: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
    },
    heading: {
        color: theme.txt,
        fontSize: 25,
        textAlign: 'center',
        marginTop: 15,
        padding: 10
    },
    imageStyle: {
        width: 200,
        height: 200,
        borderRadius: 8,
    },
    playAll: {
        marginTop: 20,
        backgroundColor: theme.brand,
        borderRadius: 50,
        paddingVertical: 15,
        paddingHorizontal: 62,
    },
    appButtonText: {
        fontSize: 18,
        color: theme.txt,
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      }
})