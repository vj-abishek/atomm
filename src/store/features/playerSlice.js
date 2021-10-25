import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  player: null,
  playerStatus: {
    streamingData: null,
    cpIndex: null,
    playImmediatly: false,
    autoplay: false
  },
  playlist: null,
  bottomPlayerStatus: {
    show: false,
    isLoading: false,
  }
}

const url = 'https://beatbump.ml/api/'

export const getSong = async ({ playlist, currentIndex  }) => {
  console.log('getting from bakground',  currentIndex)
  try {
      const stream = await axios({
          url: `${url}api.json`,
          method: 'POST',
          data: `endpoint=player&videoId=${playlist}&playlistId=`
      })

      if(stream.status === 200){
        return { data: stream.data, currentIndex }
      }
  } catch (err) {
      console.log(err)
      return null
  }
}

export const getPlaylistThunk = async ({ videoId, playlistId } ) => {
  try {
      const result = await axios({
          url: `${url}next.json?videoId${videoId}&playlistId=${playlistId}`,
          method: 'GET'
      })

      if(result.status === 200){
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
    },
    playNow: (state, payload) => {
      state.playerStatus = {
        ...state.playerStatus,
        playImmediatly: true
      }
    },
    updateplayerstatus: (state, payload) => {
      updatePlayerStatus(state, payload)
    }
  }
})

// Action creators are generated for each case reducer function
export const { add, updatePlayer, setPlayList, playNow, updateplayerstatus } = counterSlice.actions


export default counterSlice.reducer