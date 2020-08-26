import React, { Component } from 'react';
import { CommentsStore } from '../stores';
import {observer, inject} from 'mobx-react';

import { NewComment } from './';
import {Link} from 'react-router-dom';

@inject("FullPostStore")
@observer
class Comments extends Component {
    constructor(props) {
        super(props);
        this.showReply = null;
    }

    openReply = (id) => {
        this.showReply = id;
    }

    componentWillMount() {   
        this.props.store.setId(this.props.id, this.props.commentId, this.props.hasComments);
    }


    render() {
        return <> { !this.props.store.loadingPost 
            ?   <> { this.props.store.comments.map((comment, k) => <React.Fragment key={k}>
                    <div className="comment">
                        <div className="f6">
                            <div className="d-inline-block mr-4">Author: <span></span>
                                {comment.username == "DeletedUser" 
                                ? <span>DeletedUser</span>
                                : <Link to={`/${comment.username}`}>{comment.username}</Link>
                                }
                            </div>
                            <div className="d-inline-block"><span>Points: {comment.points} <button className="btn-icon ml-n2" onClick={() => this.props.store.togglePoints(comment.id)}>{!comment.isPointed ? <div className="gg-chevron-up"></div> : <div className="gg-chevron-up text-blue"></div>}</button></span></div>
                            {(comment.userId == this.props.store.authStore.userData.id && !comment.isDeleted) && <button onClick={() => this.props.store.deleteComment(comment.id)} className="btn-link h6 mx-2">Delete</button>}
                        </div>
                        <div className="cmnt text-bold">{comment.comment}</div>
                            <div className="f6 mt-3">{comment.timeAgo} {this.props.store.type === "comment" && <span className="mx-4">Replies: {comment.replies} {!comment.isDeleted && <button className="btn-link mx-4 h6" onClick={() => this.props.store.openReply(k)}>Reply</button> }</span>}</div>
                        {   this.props.store.type === "comment" && <ul>
                                { this.props.store.showReply == k && <NewComment type="reply" postId={this.props.id} commentId={comment.id} submitClick={this.props.FullPostStore.submitClick}/> }
                                <Comments store={comment.store} id={this.props.id} commentId={comment.id} hasComments={comment.replies > 0} /> 
                            </ul>
                        }
                    </div>
                </React.Fragment>)}</>
            : <div></div>
        }</>
    }
    
};

export default Comments;