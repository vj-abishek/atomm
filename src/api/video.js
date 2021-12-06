import axios from 'axios';
import { REACT_APP_YOUTUBE_URL } from '../../globals'

const url = `${REACT_APP_YOUTUBE_URL}player?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30`

export const getVideo = async (videoId, playlistId = null) => {

    try {

        const params = {
            isAudioOnly: true,
            user: {
                enableSafetyMode: false
            },
            context: {
                client: {
                    hl: "en",
                    clientName: "ANDROID",
                    clientVersion: "16.02",
                    utcOffsetMinutes: -new Date().getTimezoneOffset()
                },
                capabilities: {},
            },
            captionParams: {},
            params: "igMDCNgE",

            playlistId: playlistId,
            videoId: videoId
        };

        const result = await axios({
            url,
            method: 'POST',
            data: params,
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://music.youtube.com'
            }
        })

        if (result.status === 200) {
            return result.data
        }


    } catch (err) {
        console.log(err)
    }
}