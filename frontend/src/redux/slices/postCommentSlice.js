import { createSlice } from '@reduxjs/toolkit'

export const postCommentSlice = createSlice({
  name: 'postComment',
  initialState: {
    comments: {},
  },
  reducers: {
    setPostComments: (state, action) => {
      state.comments = action.payload
    },
  },
})

export const { setPostComments } = postCommentSlice.actions

export default postCommentSlice.reducer
