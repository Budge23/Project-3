import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import Icon from '@mdi/react'
import { mdiFlagVariant } from '@mdi/js'
import { Link } from 'react-router-dom'

import Loader from './Loader'
import { getUserId, isCreator, isUser } from '../lib/auth'



const Reply = (props) => {

  const token = localStorage.getItem('token')
  const [comment, updateComment] = useState({})
  const [text, setText] = useState('')
  const [user, updateUser] = useState({})
  const [pub, updatePub] = useState({})

  const id = props.match.params.id
  const commentId = props.match.params.commentId



  useEffect(() => {
    axios.get(`/api/users/${getUserId()}`)
      .then(resp => {
        updateUser(resp.data)
        console.log(resp.data)
      })

    axios.get(`/api/pub/${id}`)
      .then(resp => {
        updatePub(resp.data)
        console.log(resp.data)
      })

    axios.get(`/api/pub/${id}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        updateComment(resp.data)
        console.log(resp.data)
      })
  }, [])



  function handleReply() {
    if (text === '') {
      return
    } else {
      axios.post(`/api/pub/${id}/comments/${commentId}/new-reply`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(resp => {
          setText('')
          updateComment(resp.data)
        })
    }
  }


  function handleReplyDelete(replyId) {
    axios.delete(`/api/pub/${id}/comments/${commentId}/reply/${replyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(resp => {
        updateComment(resp.data)
      })
  }


  function handleFlag(replyId) {
    axios.get(`/api/pub/${id}/comments/${commentId}/reply/${replyId}`)
      .then(resp => {
        if (resp.data.flagged === false) {
          axios.put(`/api/pub/${id}/comments/${commentId}/reply/${replyId}`, { flagged: true }, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(resp => {
              updateComment(resp.data)
            })
        } else if (resp.data.flagged === true) {
          axios.put(`/api/pub/${id}/comments/${commentId}/reply/${replyId}`, { flagged: false }, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(resp => {
              updateComment(resp.data)
            })
        }
      })
  }


  if (comment.text === undefined) {
    return <>
      <Loader />
    </>
  }

  return <>
    <div className="reply-page">
      <div className="comment-section">
        <div className="current-comment">
          <div>{comment.text}</div>
          <div>{comment.user.username}</div>
          <div>({moment(comment.createdAt).fromNow()})</div>
          <div>
            <Link to={`/pubs/${id}`}>Back</Link>
          </div>
        </div>
        <div className="replies-section">
          <div className="replies-shown">
            {comment.replies && comment.replies.map(reply => {
              return <article key={reply._id} className="media">
                <div className="media-content">
                  <div className="content">
                    <div className="user-time">
                      <p className="username">
                        {reply.user.username}
                      </p>
                      <p>
                        ({moment(reply.createdAt).fromNow()})
                      </p>
                    </div>
                    <p>{reply.text}</p>
                  </div>
                </div>
                <div className="media-right">
                  {isUser(pub.user, user) && <Icon onClick={() => handleFlag(reply._id)} path={mdiFlagVariant}
                    size={1}
                    color={reply.flagged === true ? 'red' : 'grey'} />}
                  {isCreator(reply.user._id, user) && <button className="delete" onClick={() => handleReplyDelete(reply._id)}></button>}
                </div>
              </article>
            })}
          </div>
          <div className="add-reply">
            <article className="media">
              {token && <div className="media-content">
                <div className="field">
                  <p className="control">
                    <textarea className="textarea" placeholder="Post a reply..." onChange={event => setText(event.target.value)} value={text}>{text}</textarea>
                  </p>
                </div>
                <div className="field">
                  <p className="control">
                    <button className="button is-info" onClick={handleReply}>Post</button>
                  </p>
                </div>
              </div>}
            </article>
          </div>
        </div>
      </div>
    </div>
  </>

}

export default Reply