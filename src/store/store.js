import { configureStore } from '@reduxjs/toolkit'
import testReducer from './features/testSlice'
import player from './features/playerSlice'

export const store = configureStore({
  reducer: {
      test: testReducer,
      player
  },
})