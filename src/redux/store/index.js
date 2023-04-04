import { configureStore } from '@reduxjs/toolkit'
import connectSlice from '../connectSlice'

export const store = configureStore({
    reducer: {
      connect: connectSlice
  },
})