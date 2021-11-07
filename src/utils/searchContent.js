import axios from 'axios'

const url = 'https://music.youtube.com/youtubei/v1/search?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30'

export const searchJson = async (searchTerm) => {
    try {

        const data = {
            query: searchTerm,
            isAudioOnly: true,
            user: {
                enableSafetyMode: false
            },
            context: {
                client: {
                    clientName: 'WEB_REMIX',
                    clientVersion: '0.1'
                },
                capabilities: {},
                utcOffsetMinutes: -new Date().getTimezoneOffset()
            }
        }

        const request = await axios({
            url,
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://music.youtube.com',
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
            },
            data,
            method: 'POST'
        })

        if (request.status === 200) {
            const content = { content: request.data?.contents?.tabbedSearchResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents }
            console.log(content)
            return content
        }
    } catch (err) {
        console.log(err)
    }
}