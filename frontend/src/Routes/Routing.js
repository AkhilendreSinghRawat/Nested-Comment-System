import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Post from '../components/Post'
import PostLists from '../components/PostLists'

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<PostLists />} />
      <Route path="/posts/:id" element={<Post />} />
    </Routes>
  )
}

export default Routing
