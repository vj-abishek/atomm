import FastImage from 'react-native-fast-image'
import React from 'react'

const Image = ({ style, source }) => {

    return (
        <>
            <FastImage
                style={style}
                source={source}
                resizeMode={FastImage.resizeMode.cover}
            />
        </>
    )
}
export default Image;