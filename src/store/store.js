import { configureStore } from '@reduxjs/toolkit'
import testReducer from './features/testSlice'
import player from './features/playerSlice'
import searchSlice from './features/searchSlice'

export const store = configureStore({
  reducer: {
      test: testReducer,
      player,
      search: searchSlice
  },
})