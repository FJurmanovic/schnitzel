import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';

import { Comments } from '../components';

@inject("FullPostStore")
@observer
class FullPost extends Component {
    componentWillMount() {
        const {postId} = this.props.match.params;
        this.props.FullPostStore.componentMounted(postId);
    }

    componentWillUnmount() {
        this.props.FullPostStore.toDefault();
    }

    render() {
        return <>
        { this.props.FullPostStore.showPost  &&
            <div className='overlay' onClick={this.props.history.goBack}>
                <div className='poston screen-post' onClick={(event) => event.stopPropagation()}>
                        { this.props.FullPostStore.postObject.hasPhoto && <div className="card-image"><img src={`https://storage.googleapis.com/schnitzel/post/${this.props.FullPostStore.postObject.id}/${this.props.FullPostStore.postObject.id}${this.props.FullPostStore.postObject.photoExt}`} className="card-img-top" /></div>}
                    <div className="screen-body">    
                    {(  this.props.FullPostStore.authStore.userData.id === this.props.FullPostStore.postObject.userId) && <span className="float-right"><a href="./" onClick={() => {removePost(this.props.FullPostStore.postObject.id); this.props.history.push("/")}}>Delete post</a> | <Link to={`/post/edit/${this.props.FullPostStore.postObject.id}`}>Edit post</Link></span>}
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
                    <div>Author: <span></span>
                        {this.props.FullPostStore.postObject.username == "DeletedUser" 
                        ? <span>DeletedUser</span>
                        : <Link to={`/${this.props.FullPostStore.postObject.username}`}>{this.props.FullPostStore.postObject.username}</Link>
                        }
                    </div>
                    <div>Posted {this.props.FullPostStore.postObject.timeAgo}</div>
                    
                    <div className="f5">Points: {this.props.FullPostStore.postObject.points} <button className="btn-icon ml-n2" onClick={(e) => this.addPoint(e)}>{!this.props.FullPostStore.postObject.isPointed ? <div className="gg-chevron-up"></div> : <div className="gg-chevron-up text-blue"></div>}</button> <span className="mx-5">Comments: {this.props.FullPostStore.postObject.comments}</span></div>
                    <hr />
                    <Comments store={new this.props.FullPostStore.CommentsStore("comment")} id={this.props.FullPostStore.postObject.id} />
                    </div>
                </div>
            </div>
        }
        </>;
    }
}

export default withRouter(FullPost);