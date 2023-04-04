import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  connected: false,
  address: ''
}

export const connectSlice = createSlice({
  name: 'connect',
  initialState,
  reducers: {
    connect: (state, action) => {
      state.connected = true
      state.address = action.payload
    },
  },
})

export const { connect } = connectSlice.actions

export default connectSlice.reducer