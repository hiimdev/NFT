import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  connected: false,
  address: '',
  balance: 0,
  network: false
}

export const connectSlice = createSlice({
  name: 'connect',
  initialState,
  reducers: {
    connect: (state, action) => {
      state.connected = true
      state.address = action.payload
    },
    balance: (state, action) => { 
      state.balance = action.payload
    },
    network: (state, action) => {
      state.network = action.payload
    }
  },
})

export const { connect, balance, network } = connectSlice.actions

export default connectSlice.reducer