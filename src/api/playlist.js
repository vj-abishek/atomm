import axios from 'axios'
import { REACT_APP_YOUTUBE_URL } from '../../globals'

const url = `${REACT_APP_YOUTUBE_URL}next?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30`

export const getPlayList = async (playlistId, musicVideoType = null, token = null, param = 'wAEB8gECGAE%3D') => {

    try {

        let mvType = {}

        if (musicVideoType) {
            mvType = {
                watchEndpointMusicSupportedConfigs: {
                    watchEndpointMusicConfig: {
                        musicVideoType
                    }
                }
            }
        }

        const params = {
            playlistId,
            isAudioOnly: true,
            user: {
                enableSafetyMode: false
            },
            context: {
                client: {
                    clientName: "WEB_REMIX",
                    clientVersion: "0.1",
                    utcOffsetMinutes: -new Date().getTimezoneOffset()
                },
                capabilities: {},
            },
            enablePersistentPlaylistPanel: true,
            params: param,
            mvType
        };

        const result = await axios({
            url,
            method: 'POST',
            data: params,
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://music.youtube.com'
            },
            cancelToken: token
        })

        if (result.status === 200) {

            let { contents } = result?.data?.contents?.singleColumnMusicWatchNextResultsRenderer?.tabbedRenderer.watchNextTabbedResultsRenderer.tabs[0].tabRenderer.content.musicQueueRenderer.content.playlistPanelRenderer

            contents = contents.map((item) => {
                const LongInfo = item?.playlistPanelVideoRenderer?.longBylineText?.runs;
                const shortInfo = item?.playlistPanelVideoRenderer?.shortBylineText?.runs;

                LongInfo.length = shortInfo.length;

                return {
                    title: item?.playlistPanelVideoRenderer?.title?.runs[0].text,
                    thumbnails: item?.playlistPanelVideoRenderer?.thumbnail?.thumbnails,
                    videoId: item?.playlistPanelVideoRenderer?.videoId,
                    length: item?.playlistPanelVideoRenderer?.lengthText?.runs[0].text,
                    playlistid: item?.playlistPanelVideoRenderer?.navigationEndpoint?.watchEndpoint?.playlistId,
                    params: item?.playlistPanelVideoRenderer?.navigationEndpoint?.watchEndpoint?.params,
                    artistInfo: { artist: LongInfo }
                }
            })

            return contents
        }

    } catch (err) {
        console.log(err)
    }

}