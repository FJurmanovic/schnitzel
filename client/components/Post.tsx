import React from 'react';
import {Link} from 'react-router-dom';
import {observer} from 'mobx-react';

import {Popover} from './';

import {firstUpper} from '../common/js';

import {PopoverStore} from '../stores';


const OpenButton = (props) => {
    if (props.from == "home") {   
        return <Link to={`/post/${props.id}`}>{props.children}</Link>
    } else if (props.from == "profile") {
        return <Link to={`/post/${props.id}/1`}>{props.children}</Link>
    } else if (props.from == "explore") {
        return <Link to={`/post/${props.id}/2`}>{props.children}</Link>
    } else if (props.from == "explore-category"){
        return <Link to={`/post/${props.id}/3`}>{props.children}</Link>
    }
}

type PostType = {
    post: any,
    iter: number,
    userdata: any,
    togglePoint: any,
    authUser: any,
    from: any,
    removePost: any
}

export const Post = observer(({post, iter, userdata, togglePoint, authUser, from, removePost}: PostType) => 
    <React.Fragment key={iter}>
        <div className="card col-9 my-6">
            {post.hasPhoto && <div className="card-image"><OpenButton from={from} id={post.id}><img src={post.url} className="card-img-top" /></OpenButton></div>}
            
            <div className="f5 pr-5 mb-n3 mt-3 top-card">
            {(userdata.id == post.userId || authUser == post.userId) &&<span className="float-right">{post.isPrivate && <span>Private post | </span>}<a href="./" onClick={() => removePost(post.id)}>Delete post</a> | <Link to={`/post/edit/${post.id}`}>Edit post</Link></span>}
                <span className="author mr-2">Author: <span><Popover store={new PopoverStore} username={post.username} iter={iter} /></span></span>
            <span className="f5 mx-2 date" dangerouslySetInnerHTML={{__html: post.timeAgo}}></span>
            </div>
            <div className="card-body">
                <div className="labels my-1">
                    {post.categories.map((category, i) => {
                        return <React.Fragment key={i}>
                            {i < 4 && <Link to={`/explore/f/${category}`} className="label mr-2">{category}</Link>}
                            {i === 5 && 
                                <>
                                    <span className="others label px-2">...<div className="under-categories">
                                        <div className="categories-all">
                                            {post.categories.map((ctg, ctgid) => {
                                                return <React.Fragment key={ctgid}><Link to={`/explore/${ctg}`} className="ctg-text mx-3">{firstUpper(ctg)}</Link></React.Fragment>
                                            })}
                                        </div>
                                    </div></span>
                                    
                                </>
                            }
                        </React.Fragment>
                    })}
                </div>
                <h3>{post.title}</h3>
                <div className="f5 description">{post.description}</div>
                {post.type == "recipe" &&
                <>
                    <div className="f5 ingredients">{post.ingredients.map((ingredient, j) => {
                        return <React.Fragment key={j}>
                            {j < 2 && <div className="ingredient"><span className="ingredient-name">{ingredient.name}</span><span className="ingredient-amount">{ingredient.amount}</span><span className="ingredient-unit">{ingredient.unit}</span></div>}
                        </React.Fragment>
                        })}
                        {post.ingredients.length > 3 && <div className="ingredient">...</div>}
                    </div>
                    <div className="f5 directions">{post.directions}</div>
                </>
                }
                <div className="f5">Points: {post.points} <button className="btn-icon ml-n2" onClick={() => togglePoint(post.id, "post")}>{!post.isPointed ? <div className="gg-chevron-up"></div> : <div className="gg-chevron-up text-blue"></div>}</button> <OpenButton from={from} id={post.id}><span className="mx-5">Comments: {post.comments}</span></OpenButton></div>
            </div>

            <OpenButton from={from} id={post.id}><div className="card-footer">View recipe</div></OpenButton>
        </div>
    </React.Fragment>
);