import { configureStore } from '@reduxjs/toolkit'
import postComment from './slices/postCommentSlice'

export const store = configureStore({
  reducer: {
    postComment,
  },
})
