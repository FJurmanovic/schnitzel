import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';

import { Comments, NewComment, Popover } from '../components';
import {PopoverStore, NewCommentStore} from '../stores';


@inject("FullPostStore")
@observer
class FullPost extends Component {
    componentWillMount() {
        document.body.style.overflow = "hidden";
        const {postId} = this.props.match.params;
        this.props.FullPostStore.componentMounted(postId);
    }

    componentWillUnmount() {
        document.body.style.overflow = "visible";
        this.props.FullPostStore.toDefault();
    }

    goBack() {
        if (this.props.history.action == "PUSH") return this.props.history.goBack();
        if (this.props.FullPostStore.postObject.username !== "Deleted user") return this.props.history.push("/" + this.props.FullPostStore.postObject.username);
        return this.props.history.push("/");
    }

    render() {
        return <>
        { this.props.FullPostStore.showPost  &&
            <div className='overlay' onClick={this.goBack.bind(this)}>
                <div className='poston screen-post' onClick={(event) => event.stopPropagation()}>
                        { this.props.FullPostStore.postObject.hasPhoto && <div className="card-image"><img src={this.props.FullPostStore.postObject.url} className="card-img-top" /></div>}
                    <div className="screen-body">    
                        {(  this.props.FullPostStore.authStore.userData.id === this.props.FullPostStore.postObject.userId) && <span className="float-right"><a href="./" onClick={() => {this.props.FullPostStore.removePost(this.props.FullPostStore.postObject.id); this.props.history.push("/")}}>Delete post</a> | <Link to={`/post/edit/${this.props.FullPostStore.postObject.id}`}>Edit post</Link></span>}
                        <h3>{this.props.FullPostStore.postObject.title}</h3>
                        <div className="screen-description">{this.props.FullPostStore.postObject.description}</div>
                        {this.props.FullPostStore.postObject.type == "recipe" && <>
                        <div className="screen-ingredients">{this.props.FullPostStore.postObject.ingredients.map((ingredient, j) => {
                            return <React.Fragment key={j}>
                            <div className="ingredient">
                                <span className="ingredient-name">{ingredient.name}</span><span className="ingredient-amount">{ingredient.amount}</span><span className="ingredient-unit">{ingredient.unit}</span>
                            </div>
                            </React.Fragment>
                            })}
                        </div>
                        <div className="screen-directions">{this.props.FullPostStore.postObject.directions}</div>
                        </>}
                        <div className="author">Author: <span></span>
                            {this.props.FullPostStore.postObject.username == "DeletedUser" 
                            ? <span>DeletedUser</span>
                            : <span><Popover store={new PopoverStore} username={this.props.FullPostStore.postObject.username} iter="1" /></span>
                            }
                        </div>
                        <div dangerouslySetInnerHTML={{__html: this.props.FullPostStore.postObject.timeAgo}}></div>
                        
                        <div className="f5">Points: {this.props.FullPostStore.postObject.points} <button className="btn-icon ml-n2" onClick={this.props.FullPostStore.togglePoints}>{!this.props.FullPostStore.postObject.isPointed ? <div className="gg-chevron-up"></div> : <div className="gg-chevron-up text-blue"></div>}</button> <span className="mx-5">Comments: {this.props.FullPostStore.postObject.comments}</span></div>
                        <hr />
                        <NewComment
                            store={new NewCommentStore("comment", this.props.FullPostStore.postObject.id, null, this.props.FullPostStore.submitClick)}
                        />
                        <div className="comments">
                            <Comments store={this.props.FullPostStore.commentStore} id={this.props.FullPostStore.postObject.id} hasComments={this.props.FullPostStore.postObject.comments > 0} />
                        </div>
                    </div>
                </div>
            </div>
        }
        </>;
    }
}

export default withRouter(FullPost);