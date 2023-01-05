import React from 'react'
import Comment from './Comment'

const CommentList = ({ comments, setComments }) => {
  return comments?.map((comment) => (
    <div key={comment.id} className="comment-stack">
      <Comment {...comment} setComments={setComments} />
    </div>
  ))
}

export default CommentList
