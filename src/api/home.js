import axios from 'axios'
import { REACT_APP_YOUTUBE_URL } from '../../globals'

const url = `${REACT_APP_YOUTUBE_URL}browse`

let continuation = null;
let itct = null;
let key = 'AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30'
let type = 'next'
let isFirst = true;


const formatData = (content) => content.map((item) => {

    if (item?.musicImmersiveCarouselShelfRenderer) {
        isFirst = false;
        const current = item?.musicImmersiveCarouselShelfRenderer
        return {
            type: 'musicBackground',
            title: 'bg',
            backgroundImage: current.backgroundImage.simpleVideoThumbnailRenderer.thumbnail.thumbnails[0].url,
            header: {
                title: current?.header?.musicCarouselShelfBasicHeaderRenderer.title?.runs[0].text,
                strapline: current?.header?.musicCarouselShelfBasicHeaderRenderer.strapline?.runs[0].text,
            },
            data: current.contents.map((content) => {
                const contentCurrent = content?.musicTwoRowItemRenderer

                return {
                    aspectRatio: contentCurrent.aspectRatio,
                    title: contentCurrent.title?.runs[0].text,
                    subtitle: contentCurrent.subtitle.runs,
                    type: contentCurrent.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig.pageType,
                    browseId: contentCurrent?.navigationEndpoint?.browseEndpoint?.browseId,
                    endpoints: contentCurrent?.navigationEndpoint?.browseEndpoint?.browseId,
                    thumbnail: contentCurrent.thumbnailRenderer?.musicThumbnailRenderer.thumbnail.thumbnails[0].url,
                }
            })
        }
    }

    if (item?.musicCarouselShelfRenderer) {

        const current = item?.musicCarouselShelfRenderer

        if ('numItemsPerColumn' in current) {
            const obj = {
                type: 'video',
                isFirst,
                title: current?.header.musicCarouselShelfBasicHeaderRenderer?.title?.runs[0]?.text,
                data: current?.contents?.map((content) => {
                    const currentLocal = content?.musicResponsiveListItemRenderer
                    return {
                        title: currentLocal?.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
                        subtitle: currentLocal?.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text.runs,
                        musicVideoType: currentLocal?.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text.runs[0]?.navigationEndpoint?.watchEndpoint?.watchEndpointMusicSupportedConfigs.watchEndpointMusicConfig.musicVideoType,
                        thumbnail: currentLocal?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails[0].url,
                        watchEndpoint: currentLocal?.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text.runs[0]?.navigationEndpoint?.watchEndpoint,
                    }
                })
            }

            isFirst = false;

            return obj
        }

        const obj = {
            isFirst,
            title: current?.header.musicCarouselShelfBasicHeaderRenderer?.title?.runs[0]?.text,
            type: 'album',
            data: current?.contents?.map((content) => {
                return {
                    title: content?.musicTwoRowItemRenderer?.title.runs[0].text,
                    subtitle: content?.musicTwoRowItemRenderer?.subtitle.runs,
                    type: content?.musicTwoRowItemRenderer?.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType,
                    thumbnail: content?.musicTwoRowItemRenderer?.thumbnailRenderer.musicThumbnailRenderer?.thumbnail?.thumbnails[1]?.url,
                    endpoints: content?.musicTwoRowItemRenderer?.navigationEndpoint?.browseEndpoint?.browseId,
                    browseId: content?.musicTwoRowItemRenderer?.navigationEndpoint?.browseEndpoint?.browseId,
                    watchEndpoint: content?.musicTwoRowItemRenderer?.navigationEndpoint?.watchEndpoint,
                }
            })
        }

        isFirst = false;

        return obj
    }

    return {
        data: [],
        title: '',
        index: 0
    }
})

export const getHome = async (browseId = 'FEmusic_home', pagination = false, token = null, refreshing = false) => {

    if (refreshing) {
        continuation = null
        itct = null
    }

    try {

        let myObj = {}

        if (!pagination) {
            myObj = {
                browseId
            }
        }

        const params = {
            ...myObj,
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
        };

        if (pagination && !continuation) return [{
            title: 'End',
            data: [],
            index: 0
        }];

        const correctURL = pagination && continuation ? `${url}?ctoken=${continuation}&continuation=${continuation}&itct=${itct}&type=${type}&key=${key}` : `${url}?key=${key}`

        const result = await axios({
            url: correctURL,
            method: 'POST',
            data: params,
            headers: {
                pragma: 'no-cache',
                'sec-ch-ua':
                    '"Microsoft Edge";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'same-origin',
                'sec-fetch-site': 'same-origin',
                'x-goog-visitor-id': 'CgttaVFvdVdoLVdzSSiViqSMBg%3D%3D',
                'x-youtube-client-name': '67',
                'x-youtube-client-version': '1.20211101.00.00',
                Referer: 'https://music.youtube.com/',
                Origin: 'https://music.youtube.com',
                'x-origin': 'https://music.youtube.com',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            },
            cancelToken: token
        })

        if (result.status === 200) {

            if ('continuationContents' in result.data && 'sectionListContinuation' in result?.data?.continuationContents) {
                let { contents, continuations } = result.data.continuationContents.sectionListContinuation

                contents = formatData(contents)

                if (continuations && continuations[0]?.nextContinuationData) {
                    const current = continuations[0].nextContinuationData


                    continuation = current.continuation
                    itct = current.clickTrackingParams
                } else {
                    return [{
                        title: 'End',
                        data: [],
                        index: 0
                    }]
                }

                return contents
            }

            let { contents, continuations } = result.data?.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer;

            if (continuations && continuations[0]?.nextContinuationData) {
                const current = continuations[0].nextContinuationData

                continuation = current.continuation
                itct = current.clickTrackingParams
            } else {
                // return [{
                //     title: 'end',
                //     data: [],
                // }]
            }

            contents = formatData(contents)

            return contents
        }

    } catch (err) {
        console.log(err)
    }

}