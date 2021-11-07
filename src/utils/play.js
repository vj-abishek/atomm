import TrackPlayer from 'react-native-track-player'
import { store } from "../store/store"
import ImageColors from 'react-native-image-colors'
import { getSong, setPlayer, setThumbnail, setVibrant, updatePlayer, updateplayerstatus } from '../store/features/playerSlice';
import theme from '../theme/theme';

const parseProxyRedir = (url) => {
  let new_url = url.replace('https://', '')
  new_url = new_url.split('/')
  new_url = new_url[2] !== undefined ? new_url[2] : new_url[1]
  url = 'https://redirector.googlevideo.com/' + new_url
  return url
}

export function shadeColor(color, percent) {

  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
  var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
  var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
}

const fetchColors = async (artwork) => {

  const result = await ImageColors.getColors(artwork, {
    fallback: theme.bg,
    quality: 'low',
    pixelSpacing: 5,
    cache: true
  })
  const { darkMuted } = result
  store.dispatch(setVibrant({
    vibrant: {
      primary: darkMuted === '#000000' ? theme.sy : darkMuted,
      secondary: shadeColor(darkMuted, -30)
    }
  }))
}

export const PlaySong = async (currentIndex = 0, videoId = null, thumbnail = null) => {
  const state = store.getState().player
  const playlist = state.playlist
  let playListId = null

  store.dispatch(updatePlayer({
    isLoading: true
  }))

  if ((playlist?.length || videoId) && currentIndex !== null) {

    if (videoId) {
      playListId = videoId
    } else {
      playListId = playlist[currentIndex].videoId
    }

    const result = await getSong({ playlist: playListId, currentIndex })
    if (result) {
      store.dispatch(updateplayerstatus(result))

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
            return arr.push(i)
          }
        }
      })

      if (arr.length !== 0) {

        let artwork = null;

        if (thumbnail) {
          artwork = thumbnail.replace('w60', 'w544').replace('h60', 'h544')
        } else {
          const tb = result.data.videoDetails.thumbnail.thumbnails
          artwork = tb.length > 1 ? tb[tb.length - 2].url : tb.thumbnails[0].url
        }

        store.dispatch(setPlayer({
          url: arr[0].url,
          title: result.data.videoDetails.title,
          duration: parseInt(result.data.videoDetails.lengthSeconds),
          artist: result.data.videoDetails.author.replace('- Topic', ''),
          thumbnail: artwork
        }))

        await TrackPlayer.reset();

        artwork = result.data.videoDetails.thumbnail.thumbnails.length > 1 ? result.data.videoDetails.thumbnail.thumbnails[1].url : result.data.videoDetails.thumbnail.thumbnails[0].url
        const playerStatus = store.getState().player.playerStatus

        if (playerStatus.url) {
          await TrackPlayer.add({
            url: playerStatus.url,
            title: playerStatus.title,
            artist: playerStatus.artist,
            artwork: artwork,
            duration: playerStatus.duration,
          })
        }

        await TrackPlayer.play()

        fetchColors(artwork)

      }
      store.dispatch(updatePlayer({
        isLoading: false
      }))
    }
  }
}

export const Next = () => {
  const state = store.getState().player
  const playlist = state?.playlist

  if (!playlist) return

  const index = state.playerStatus.cpIndex + 1
  const currentIndex = index > playlist.length - 1 ? 0 : index

  PlaySong(currentIndex)
}

export const Previous = async () => {
  const position = await TrackPlayer.getPosition();

  if (position > 3) {
    TrackPlayer.seekTo(0);
  } else {
    const state = store.getState().player
    const index = state.playerStatus.cpIndex
    const currentIndex = index === 0 ? 0 : index - 1

    PlaySong(currentIndex)
  }

}