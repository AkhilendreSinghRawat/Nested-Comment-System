import React from 'react'
import IconBtn from './IconBtn'
import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from 'react-icons/fa'
import CommentList from './CommentList'
import { useSelector } from 'react-redux'
import CommentForm from './CommentForm'
import { useAsyncFn } from '../hooks/useAsync'
import {
  createComment,
  deleteComment,
  toggleCommentLike,
  updateComment,
} from '../services/commentServices'
import { useParams } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const Comment = ({
  id,
  message,
  user,
  createdAt,
  likeCount,
  likedByMe,
  setComments,
}) => {
  const { id: postId } = useParams()
  const currentUser = useUser()
  const comments = useSelector((state) => state.postComment.comments)

  const [areChildrenHidden, setAreChildrenHidden] = React.useState(false)
  const [isReplying, setIsReplying] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)

  const createCommentFn = useAsyncFn(createComment)
  const updateCommentFn = useAsyncFn(updateComment)
  const deleteCommentFn = useAsyncFn(deleteComment)
  const toggleCommentLikeFn = useAsyncFn(toggleCommentLike)

  const onCommentReply = (message) => {
    return createCommentFn
      .execute({ postId: postId, message, parentId: id })
      .then((comment) => {
        setIsReplying(false)
        setComments((prev) => [comment, ...prev])
      })
  }

  const onCommentUpdate = (message) => {
    return updateCommentFn
      .execute({ postId: postId, message, id })
      .then((comment) => {
        setIsEditing(false)
        setComments((prev) => {
          return prev.map((comment) => {
            if (comment.id === id) {
              return { ...comment, message }
            }
            return comment
          })
        })
      })
  }

  const onCommentDelete = () => {
    return deleteCommentFn.execute({ postId: postId, id }).then((comment) => {
      setComments((prev) => prev.filter((comment) => comment.id !== id))
    })
  }

  const onToggleCommentLike = () => {
    return toggleCommentLikeFn
      .execute({ id, postId: postId })
      .then(({ addLike }) =>
        setComments((prevComments) => {
          return prevComments.map((comment) => {
            if (id === comment.id) {
              if (addLike) {
                return {
                  ...comment,
                  likeCount: comment.likeCount + 1,
                  likedByMe: true,
                }
              } else {
                return {
                  ...comment,
                  likeCount: comment.likeCount - 1,
                  likedByMe: false,
                }
              }
            } else {
              return comment
            }
          })
        })
      )
  }

  return (
    <>
      <div className="comment">
        <div className="header">
          <span className="name">{user.name}</span>
          <span className="date">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>
        {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={message}
            onSubmit={onCommentUpdate}
            loading={updateCommentFn?.loading}
            error={updateCommentFn?.error}
          />
        ) : (
          <div className="message">{message}</div>
        )}
        <div className="footer">
          <IconBtn
            onClick={onToggleCommentLike}
            disabled={toggleCommentLikeFn.loading}
            Icon={likedByMe ? FaHeart : FaRegHeart}
            aria-label={likedByMe ? 'Unlike' : 'Like'}
          >
            {likeCount}
          </IconBtn>
          <IconBtn
            onClick={() => setIsReplying((prev) => !prev)}
            isActive={isReplying}
            Icon={FaReply}
            aria-label={isReplying ? 'Cancel Reply' : 'Reply'}
          />
          {user.id === currentUser.id && (
            <>
              <IconBtn
                onClick={() => setIsEditing((prev) => !prev)}
                isActive={isEditing}
                Icon={FaEdit}
                aria-label={isEditing ? 'Cancel Edit' : 'Edit'}
              />
              <IconBtn
                disabled={deleteCommentFn.loading}
                onClick={onCommentDelete}
                Icon={FaTrash}
                aria-label="Delete"
                color="danger"
              />
            </>
          )}
        </div>
        {deleteCommentFn?.error && (
          <div className="error-msg mt-1">{deleteCommentFn?.error}</div>
        )}
      </div>
      {isReplying && (
        <div className="mt-1 ml-3">
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            loading={createCommentFn.loading}
            error={createCommentFn.error}
          />
        </div>
      )}
      {comments[id]?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack ${
              areChildrenHidden ? 'hide' : ''
            }`}
          >
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments">
              <CommentList comments={comments[id]} setComments={setComments} />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden ? 'hide' : ''}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies
          </button>
        </>
      )}
    </>
  )
}

export default Comment
