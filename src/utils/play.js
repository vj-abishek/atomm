import TrackPlayer from 'react-native-track-player'
import { store } from "../store/store"
import ImageColors from 'react-native-image-colors'
import {
  getSong,
  setVibrant,
  updatePlayer,
  updateplayerstatus,
  setIsDownloading
} from '../store/features/playerSlice';
import theme from '../theme/theme';
import ReactNativeBlobUtil from 'react-native-blob-util'
import { MMKV } from '../storage/index';
import { PermissionsAndroid, ToastAndroid } from 'react-native';

let settings = store.getState().player.settings

export const updateSettings = () => {
  settings = store.getState().player.settings
}


// convert title  to seo friently url

function toSeoUrl(url) {
  return url.toString()               // Convert to string
    .normalize('NFD')               // Change diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove illegal characters
    .replace(/\s+/g, '-')            // Change whitespace to dashes
    .toLowerCase()                  // Change to lowercase
    .replace(/&/g, '-and-')          // Replace ampersand
    .replace(/[^a-z0-9\-]/g, '')     // Remove anything that is not a letter, number or dash
    .replace(/-+/g, '-')             // Remove duplicate dashes
    .replace(/^-*/, '')              // Remove starting dashes
    .replace(/-*$/, '');             // Remove trailing dashes
}

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
    cache: true,
    key: artwork.split('/')[4]
  })

  const { darkMuted } = result
  const vibrant = {
    primary: darkMuted === '#000000' ? theme.sy : darkMuted,
    secondary: shadeColor(darkMuted, -30)
  }
  store.dispatch(setVibrant({
    vibrant
  }))

  return vibrant
}

const formatDownloadURL = (result, label) => {

  const formatParent = result.data.streamingData['formats'].concat(
    result.data.streamingData['adaptiveFormats']
  )

  const quality = (!settings && !settings[label]) ? 'AUDIO_QUALITY_LOW' : settings[label]

  console.log('Final quality', quality)

  let arr = []

  // console.log(formatParent)

  formatParent.forEach((i) => {
    if (i.mimeType.includes('audio')) {
      if (
        i.audioChannels === 2 &&
        i.audioQuality.includes(quality)
      ) {
        // i.url = parseProxyRedir(i.url)
        return arr.push(i)
      } else if (i.audioChannels === 1 &&
        i.audioQuality.includes(quality)) {
        return arr.push(i)
      }
    }
  })

  return arr
}

const handleDownload = (resp, data) => {
  const path = resp.path()

  store.dispatch(setIsDownloading({
    isDownloading: false,
    downloaded: true
  }))

  console.log('saved at ', path)

  const oldOfflineSongs = MMKV.getArray('offline')


  if (oldOfflineSongs) {
    const alreadyPreset = oldOfflineSongs.some(i => i.videoId === data.videoId)

    if (alreadyPreset) {
      ToastAndroid.show('Song already downloaded', ToastAndroid.SHORT)
      return;
    }

    ToastAndroid.show('Song downloaded', ToastAndroid.SHORT)

    const formated = {
      ...data,
      url: `file://${path}`,
      isOffline: true
    }

    MMKV.setArray('offline', [...oldOfflineSongs, formated])
    return;
  }
  ToastAndroid.show('Song downloaded', ToastAndroid.SHORT)

  MMKV.setArray('offline', [{
    ...data,
    url: `file://${path}`,
    isOffline: true
  }])
}

const PlayHelper = async (songData) => {

  let art = null

  const { url, title, artist, artwork, duration, playListId, playID, tb, thumbnail } = songData

  // console.log(url)

  if (thumbnail) {
    art = thumbnail.replace('w60', 'w544').replace('h60', 'h544')
  } else if (artwork) {
    art = artwork
  } else {
    art = tb[tb.length - 1].url
  }

  await TrackPlayer.add({
    url,
    title,
    artist,
    artwork: art,
    duration,
  })

  await TrackPlayer.play()

  fetchColors(art)

  const obj = {
    url,
    title,
    duration,
    artist,
    artwork: art
  }

  const currentsong = {
    ...obj,
    videoId: playListId ? playListId : null,
    url: null,
    playlistId: playID
  }

  MMKV.setMap('currentsong', currentsong);
}

export const PlaySong = async (currentIndex = 0, videoId = null, thumbnail = null, playID = null, offlineData = null) => {


  store.dispatch(updatePlayer({
    isLoading: true
  }))

  await TrackPlayer.reset();

  const state = store.getState().player
  const playlist = state.playlist
  let playListId = null

  if ((playlist?.length || videoId) && currentIndex !== null) {

    if (videoId) {
      playListId = videoId
    } else {
      playListId = playlist[currentIndex].videoId

      if (playlist[currentIndex]?.isOffline) {
        offlineData = playlist[currentIndex]
      }
    }

    if (offlineData) {
      console.log('playing offline', offlineData)

      store.dispatch(updateplayerstatus({
        currentIndex
      }))

      PlayHelper({
        ...offlineData,
        playListId,
        playID,
        thumbnail: offlineData.artwork
      })

      store.dispatch(updatePlayer({
        isLoading: false
      }))

      return
    }

    const result = await getSong({ playlist: playListId, currentIndex })
    if (result) {
      store.dispatch(updateplayerstatus(result))

      const arr = formatDownloadURL(result, 'Audio Quality')

      if (arr.length !== 0) {

        // let artwork = null;
        const url = arr[0].url
        const title = result.data.videoDetails.title
        const duration = parseInt(result.data.videoDetails.lengthSeconds)
        const artist = result.data.videoDetails.author.replace('- Topic', '')
        const tb = result.data.videoDetails.thumbnail.thumbnails

        PlayHelper({
          url,
          title,
          duration,
          artist,
          tb,
          artwork: null,
          playListId,
          playID,
          thumbnail
        })

      }
      store.dispatch(updatePlayer({
        isLoading: false
      }))
    } else {
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

export const DownloadSong = async () => {

  const song = MMKV.getMap('currentsong')

  if (song) {
    const result = await getSong({ playlist: song.videoId, currentIndex: null })

    const arr = formatDownloadURL(result, 'Download Quality')
    const url = arr[0].url
    const mimeType = arr[0].mimeType.split(';')[0]

    ToastAndroid.show('Downloading the song', ToastAndroid.SHORT);

    store.dispatch(setIsDownloading({
      isDownloading: true,
      downloaded: false
    }))

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Atomm storage permission",
          message:
            "Atomm music app needs access to your storage " +
            "so you can download the song.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {

        let dirs = ReactNativeBlobUtil.fs.dirs

        ReactNativeBlobUtil
          .config({
            fileCache: true,
            appendExt: 'm4a',
            path: dirs.DownloadDir + '/' + toSeoUrl(song?.title) + '.m4a',
          })
          .fetch('GET', url)
          .then((resp) => handleDownload(resp, song))
          .catch(err => {
            ToastAndroid.show('Something went wrong.', ToastAndroid.SHORT)
            console.log(err)
          })

      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }


  } else {
    ToastAndroid.show('Something went wrong', ToastAndroid.SHORT)
  }
}