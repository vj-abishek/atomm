import TrackPlayer from 'react-native-track-player'
import { store } from "../store/store"
import { getSong, updatePlayer, updateplayerstatus } from '../store/features/playerSlice';

const parseProxyRedir = (url) => {
	let new_url = url.replace('https://', '')
	new_url = new_url.split('/')
	new_url = new_url[2] !== undefined ? new_url[2] : new_url[1]
	url = 'https://redirector.googlevideo.com/' + new_url
	return url
}

export const PlaySong = async (currentIndex = 0, videoId = null) => {
    const state = store.getState().player
    const playlist = state.playlist
    let playListId = null

    store.dispatch(updatePlayer({
          isLoading: true
    }))

    if(playlist.length && currentIndex !== null) {
      playListId = playlist[currentIndex].videoId

      if(videoId) {
          playListId = videoId
      }

      const result = await getSong({ playlist: playListId, currentIndex })
      if(result) {
        const formatParent = result.data.streamingData['formats'].concat(
          result.data.streamingData['adaptiveFormats']
        )

        let arr = []

        formatParent.map((i) => {
          if (i.mimeType.includes('audio')) {
              if (
                  i.audioChannels === 2 &&
                  i.audioQuality.includes('AUDIO_QUALITY_MEDIUM')
              ) {
                  i.url = parseProxyRedir(i.url)
                  return arr.push(i)
              }
          }
        })

        if(arr.length !== 0) {

          await TrackPlayer.reset();

          await TrackPlayer.add({
              url: arr[0].url,
              title: result.data.videoDetails.title,
              artwork: result.data.videoDetails.thumbnail.thumbnails[0].url,
              duration: parseInt(result.data.videoDetails.lengthSeconds),
              artist: result.data.videoDetails.author
          })

          await TrackPlayer.play()

          store.dispatch(updateplayerstatus(result))
        }
        store.dispatch(updatePlayer({
            isLoading: false
        }))
      }
    }
}

export const Next = () => {
    const state = store.getState().player
    const playlist = state.playlist
    const index = state.playerStatus.cpIndex + 1
    const currentIndex = index > playlist.length ? 0 : index

    PlaySong(currentIndex)
}

export const Previous = () => {
    const state = store.getState().player
    const index = state.playerStatus.cpIndex
    const currentIndex = index === 0 ? 0 : index + 1

    PlaySong(currentIndex)
}