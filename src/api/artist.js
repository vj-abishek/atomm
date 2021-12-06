import axios from 'axios'
import { REACT_APP_YOUTUBE_URL } from '../../globals'

const url = `${REACT_APP_YOUTUBE_URL}browse?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30`

export const getArtistDetails = async (browseId) => {

    try {

        const params = {
            browseId,
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
            }
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
            const { header, contents } = result.data;
            const headerData = {
                title: 'header',
                data: [{
                    title: header.musicImmersiveHeaderRenderer.title?.runs[0].text,
                    thumbnail: header.musicImmersiveHeaderRenderer.thumbnail?.musicThumbnailRenderer.thumbnail?.thumbnails?.slice(-2, -1)[0]?.url,
                    description: header.musicImmersiveHeaderRenderer.description?.runs[0]?.text,
                }]
            }

            const rows = contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents

            const contentData = rows.map((row) => {
                if (row?.musicShelfRenderer) {
                    return {
                        title: row?.musicShelfRenderer?.title?.runs[0]?.text,
                        type: 'songs',
                        data: row?.musicShelfRenderer?.contents?.map((content) => {
                            return {
                                title: content.musicResponsiveListItemRenderer?.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
                                subtitle: content.musicResponsiveListItemRenderer?.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs,
                                watchEndpoint: content.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint.watchEndpoint,
                                thumbnail: content.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer?.thumbnail?.thumbnails[1]?.url,
                            }
                        })
                    }
                }

                if (row?.musicCarouselShelfRenderer) {
                    return {
                        title: row?.musicCarouselShelfRenderer?.header.musicCarouselShelfBasicHeaderRenderer?.title?.runs[0]?.text,
                        data: row?.musicCarouselShelfRenderer?.contents?.map((content) => {
                            return {
                                title: content.musicTwoRowItemRenderer.title.runs[0].text,
                                subtitle: content.musicTwoRowItemRenderer.subtitle.runs,
                                type: content?.musicTwoRowItemRenderer?.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType,
                                thumbnail: content?.musicTwoRowItemRenderer?.thumbnailRenderer.musicThumbnailRenderer?.thumbnail?.thumbnails[1]?.url,
                                endpoints: content?.musicTwoRowItemRenderer?.navigationEndpoint?.browseEndpoint?.browseId,
                                watchEndpoint: content?.musicTwoRowItemRenderer?.navigationEndpoint?.watchEndpoint,
                            }
                        })
                    }
                }

                if (row?.musicDescriptionShelfRenderer) {
                    return {
                        title: row?.musicDescriptionShelfRenderer?.header?.runs[0]?.text,
                        data: [{
                            description: row?.musicDescriptionShelfRenderer?.description?.runs[0]?.text,
                            subHeader: row?.musicDescriptionShelfRenderer?.subheader?.runs[0]?.text,
                            type: 'about'
                        }]
                    }
                }


            })


            const response = [headerData, ...contentData]

            return response;
        }

    } catch (err) {
        console.log(err);
        return null;
    }
}