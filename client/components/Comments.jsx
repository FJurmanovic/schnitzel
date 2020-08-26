import React, { Component } from 'react';
import { CommentsStore } from '../stores';
import {observer, inject} from 'mobx-react';

import {Link} from 'react-router-dom';

const Comment = ({type, postId, commentid, submitClick}) => {
    
    return <form onSubmit={this.handleSubmit} className="mb-8">
        <label>New comment: <br />
            <textarea 
                onChange={this.handleComment}
                value={this.state.commentVal}
                className="width-full"
            />
        </label>
        <input type="submit" value="Submit" className="btn btn-default btn-squared px-6" />
    </form>
}

@inject("FullPostStore")
@observer
class Comments extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {   
        this.props.store.setId(this.props.id, this.props.commentId)
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
                            <div className="d-inline-block"><span>Points: {comment.points.length} <button className="btn-icon ml-n2" onClick={(e) => this.addPointToComment(e, k)}>{!comment.isPointed ? <div className="gg-chevron-up"></div> : <div className="gg-chevron-up text-blue"></div>}</button></span> <span><button onClick={(e) => this.openReply(e, k)}>Reply</button></span></div>
                        </div>
                        
                        <div className="cmnt text-bold">{comment.comment}</div>
                        <ul>
                            { comment.replies > 0 && <Comments store={new this.props.FullPostStore.CommentsStore("reply")} id={this.props.id} commentId={comment.id} /> }
                        </ul>
                    </div>
                </React.Fragment>)}</>
            : <div></div>
        }</>
    }
    
};

export default Comments;