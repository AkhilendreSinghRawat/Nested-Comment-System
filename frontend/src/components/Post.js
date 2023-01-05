import React from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAsync, useAsyncFn } from '../hooks/useAsync'
import { setPostComments } from '../redux/slices/postCommentSlice'
import { createComment } from '../services/commentServices'
import { getPost } from '../services/postServices'
import CommentForm from './CommentForm'
import CommentList from './CommentList'

const Post = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [comments, setComments] = React.useState([])
  const { loading, error, value: post } = useAsync(() => getPost(id), [id])
  const {
    loading: loadingCreateComment,
    error: errorCreateComment,
    execute: CreateCommentFn,
  } = useAsyncFn(createComment)

  const onCommentCreate = (message) => {
    return CreateCommentFn({ postId: id, message }).then((comment) =>
      setComments((prev) => [comment, ...prev])
    )
  }

  const commentsByParentId = React.useMemo(() => {
    const group = {}
    comments.forEach((comment) => {
      group[comment?.parentId] ||= []
      group[comment?.parentId].push(comment)
    })
    return group
  }, [comments])

  React.useEffect(() => {
    if (post?.comments) {
      setComments(post?.comments)
    }
  }, [post?.comments])
  React.useEffect(() => {
    if (commentsByParentId && Object.keys(commentsByParentId).length > 0) {
      dispatch(setPostComments(commentsByParentId))
    }
  }, [commentsByParentId, dispatch])

  const loadingJsx = () => <h1>Loading</h1>
  const errorJsx = () => <h1 className="error-msg">{error}</h1>
  const postJsx = () => (
    <>
      <h1>{post?.title}</h1>
      <article>{post?.body}</article>
      <h3 className="comments-title">Comments</h3>
      <section>
        <CommentForm
          loading={loadingCreateComment}
          error={errorCreateComment}
          onSubmit={onCommentCreate}
        />
        {commentsByParentId[null] != null &&
          commentsByParentId[null].length > 0 && (
            <div className="mt-4">
              <CommentList
                comments={commentsByParentId[null]}
                setComments={setComments}
              />
            </div>
          )}
      </section>
    </>
  )

  return loading ? loadingJsx() : error ? errorJsx() : postJsx()
}

export default Post
