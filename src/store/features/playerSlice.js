import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { REACT_APP_API_URL } from '../../../globals'
import { getPlayList } from '../../api/playlist'
import { getVideo } from '../../api/video'
import theme from '../../theme/theme'


const initialState = {
  player: null,
  playerStatus: {
    streamingData: null,
    cpIndex: null,
    playImmediatly: false,
    autoplay: false,
    url: null,
    title: null,
    duration: null,
    artist: null,
    thumbnail: null,
  },
  playlist: null,
  bottomPlayerStatus: {
    show: false,
    isLoading: false,
  },
  randomId: null,
  vibrant: {
    primary: theme.sy,
    secondary: theme.sy,
  },
  focusSearch: {
    count: 0,
    isFocused: false,
  },
  playlistId: null,
}

const url = `${REACT_APP_API_URL}api/`

export const getSong = async ({ playlist, currentIndex }) => {
  console.log('getting from bakground', currentIndex)
  try {
    // const stream = await axios({
    //   url: `${url}api.json`,
    //   method: 'POST',
    //   data: `endpoint=player&videoId=${playlist}&playlistId=`
    // })

    const data = await getVideo(playlist)
    return { data, currentIndex }

  } catch (err) {
    console.log(err)
    return null
  }
}

export const getQueue = async ({ playlistId }) => {
  try {
    const stream = await axios({
      url: `${url}getQueue.json?&playlistId=${playlistId}`,
      method: 'GET'
    })

    if (stream.status === 200) {
      return { playlist: stream.data }
    }
  } catch (err) {
    console.log(err)
    return null
  }
}

export const getPlaylistThunk = async ({ videoId, playlistId }) => {
  try {
    const result = await axios({
      url: `${url}next.json?videoId${videoId}&playlistId=${playlistId}`,
      method: 'GET'
    })

    // const playlist = await getPlayList(playlistId, musicVideoType)
    if (result.status === 200) {
      return { playlist: result.data.results }
    }

  } catch (err) {
    console.log(err)
  }
}


const updatePlayerStatus = (state, { payload }) => {
  state.playerStatus = {
    ...state.playerStatus,
    cpIndex: payload.currentIndex,
  }

  state.bottomPlayerStatus = {
    ...state.bottomPlayerStatus,
    isLoading: false
  }
}


export const counterSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    add: (state, payload) => {
      state.player = payload
    },
    updatePlayer: (state, { payload }) => {
      state.bottomPlayerStatus = {
        ...state.bottomPlayerStatus,
        ...payload
      }
    },
    setPlayList: (state, { payload }) => {
      state.playlist = payload.playlist

      state.playlistId = payload.playlistId
    },
    playNow: (state, payload) => {
      state.playerStatus = {
        ...state.playerStatus,
        playImmediatly: true
      }
    },
    updateplayerstatus: (state, payload) => {
      updatePlayerStatus(state, payload)
    },
    setRandomId: (state, { payload }) => {
      state.randomId = payload.randomId
    },
    setThumbnail: (state, { payload }) => {
      state.playerStatus.thumbnail = payload.thumbnail
    },
    setVibrant: (state, { payload }) => {
      state.vibrant = payload.vibrant
    },
    setPlayer: (state, { payload }) => {
      state.playerStatus = {
        ...state.playerStatus,
        ...payload
      }
    },
    setFocusSearch: (state, { payload }) => {
      state.focusSearch = payload.focusSearch
    }
  }
})

// Action creators are generated for each case reducer function
export const { add, updatePlayer, setPlayList, playNow, updateplayerstatus, setRandomId, setThumbnail, setVibrant, setPlayer, setFocusSearch } = counterSlice.actions


export default counterSlice.reducer