import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  search: null,
}

export const counterSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (state, { payload }) =>  {
        state.search = payload.search
    }
  },
})

// Action creators are generated for each case reducer function
export const { setSearch } = counterSlice.actions

export default counterSlice.reducer