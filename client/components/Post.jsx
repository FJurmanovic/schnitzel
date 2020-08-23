import React, {useState} from 'react';
import {Link} from 'react-router-dom';

const OpenButton = (props) => {
    if (props.from == "home") {   
        return <Link to={`/post/${props.id}`}>{props.children}</Link>
    } else if (props.from == "profile") {
        return <Link to={`/post/${props.id}/1`}>{props.children}</Link>
    } else if (props.from == "explore") {
        return <Link to={`/post/${props.id}/2`}>{props.children}</Link>
    }
}

export const Post = ({post, iter, userdata, addPoint, authUser, from, dataByUsername}) => {
    const [authorData, setAuthorData] = useState(
        {
            id: '',
            postNum: 0,
            username: post.username
        }
    );

    const [isFetch, setIsFetch] = useState(false);
    
    const getAuthorData = async(id) => {
        if(!isFetch){
            
            let data = await dataByUsername(id);
            if(data) {
                setAuthorData(data);
                setIsFetch(true);
            }
        }
    }

    return <React.Fragment key={iter}>
        <>
            <div className="card col-9 my-6">
                {post.hasPhoto && <div className="card-image"><OpenButton from={from} id={post.id}><img src={`https://storage.googleapis.com/schnitzel/post/${post.id}/${post.id}${post.photoExt}`} className="card-img-top" /></OpenButton></div>}
                
                <div className="f5 pr-5 mb-n3 mt-3 top-card">
                {(userdata.id == post.userId || authUser == post.userId) &&<span className="float-right"><a href="./" onClick={() => removePost(post.id)}>Delete post</a> | <Link to={`/post/edit/${post.id}`}>Edit post</Link></span>}
                    <span className="author mr-2">Author: <span></span>
                        {post.username == "DeletedUser" 
                        ? <span>DeletedUser</span>
                        : <Link className="f5" onMouseOver={() => getAuthorData(post.username)} to={`/${post.username}`}>{post.username}</Link>
                        }
                        <Link className="popover-author" to={`/${post.username}`}>
                            <div className="" id={`popover_${iter}`}>
                                <div className="md-photo">
                                    {authorData.hasPhoto ? <img src={`https://storage.googleapis.com/schnitzel/avatar/${authorData.id}/${authorData.id}${authorData.photoExt}`} className="card-img-top" /> : <img src="https://storage.googleapis.com/schnitzel/default.jpg" className="card-img-top" />} 
                                    <span className="author-user">{post.username}</span>
                                    <span className="author-post">Posts: {authorData.postNum}</span>
                                </div>
                            </div>
                        </Link>
                    </span>
                <span className="f5 mx-2 date">Posted {post.timeAgo}</span>
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
                    <div className="f5">Points: {post.points.length} <button className="btn-icon ml-n2" onClick={(e) => addPoint(e, iter)}>{!post.isPointed ? <div className="gg-chevron-up"></div> : <div className="gg-chevron-up text-blue"></div>}</button> <OpenButton from={from} id={post.id}><span className="mx-5">Comments: {post.comments}</span></OpenButton></div>
                </div>

                <OpenButton from={from} id={post.id}><div className="card-footer">View recipe</div></OpenButton>
            </div>
        </>
    </React.Fragment>
}