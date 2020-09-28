import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';

import { NewComment, Popover } from './';

import {PopoverStore, NewCommentStore} from '../stores';

interface CommentsProps {
    store: any,
    FullPostStore?: any,
    id: string,
    commentId?: string,
    hasComments: boolean
}

@inject("FullPostStore")
@observer
class Comments extends Component<CommentsProps> {
    constructor(props) {
        super(props);
    }

    componentWillMount() {   
        this.props.store.setId(this.props.id, this.props.commentId, this.props.hasComments);
    }


    render() {
        return <> { !this.props.store.loadingPost 
            ?   <> { this.props.store.comments.map((comment, k) => <React.Fragment key={k}>
                    <div className="comment">
                        <div className="f6">
                            <div className="d-inline-block mr-4 author">Author: <span></span>
                                {comment.username == "DeletedUser" 
                                ? <span>DeletedUser</span>
                                : <span><Popover store={new PopoverStore} username={comment.username} iter={k} /></span>
                                }
                            </div>
                            <div className="d-inline-block"><span>Points: {comment.points} <button className="btn-icon ml-n2" onClick={() => this.props.store.togglePoints(comment.id)}>{!comment.isPointed ? <div className="gg-chevron-up"></div> : <div className="gg-chevron-up text-blue"></div>}</button></span></div>
                            {(comment.userId == this.props.store.authStore.userData.id && !comment.isDeleted) && <span><button onClick={() => this.props.store.editClick(k)} className="btn-link h6 mx-2">{this.props.store.isEditing === k ? "Cancel" : "Edit"}</button> | <button onClick={() => this.props.store.deleteComment(comment.id)} className="btn-link h6 mx-2">Delete</button></span>}
                        </div>
                        {this.props.store.isEditing == k
                        ?   <form onSubmit={() => this.props.store.saveEdit(this.props.store.type, comment.id, this.props.store.commentId, this.props.store.postId)}>
                                <textarea 
                                    onChange={(e) => this.props.store.editChange(e.target.value)}
                                    defaultValue={comment.comment}
                                    className="width-full"
                                />
                                <input type="submit" value="Save" />
                            </form>
                        : <div className="cmnt text-bold">{comment.comment}</div>
                        }
                            <div className="f6 mt-3"><span dangerouslySetInnerHTML={{__html: comment.timeAgo}}></span> {this.props.store.type === "comment" && <span className="mx-4">Replies: {comment.replies} {!comment.isDeleted && <button className="btn-link mx-4 h6" onClick={() => this.props.store.openReply(k)}>Reply</button> }</span>}</div>
                        {   this.props.store.type === "comment" && <ul>
                                { this.props.store.showReply == k && <NewComment store={new NewCommentStore("reply", this.props.id, comment.id, this.props.FullPostStore.submitClick)} /> }
                                <Comments store={comment.store} id={this.props.id} commentId={comment.id} hasComments={comment.replies > 0} /> 
                            </ul>
                        }
                    </div>
                </React.Fragment>)}
                {!this.props.store.last && <button className="btn-link" onClick={this.props.store.getComments}>Load more</button>}
                </>
            : <div></div>
        }</>
    }
    
};

export default Comments;