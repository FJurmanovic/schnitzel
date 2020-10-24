import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import { Post, NewPost, ScrollTop } from '../components';


type FeedProps = {
    FeedStore?: any;
}

@inject("FeedStore")
@observer
class Feed extends Component<FeedProps> {
    componentWillMount() {
        this.props.FeedStore.postsGet();
        window.addEventListener('scroll', this.props.FeedStore.handleScroll);
    }

    componentWillUnmount() {
        this.props.FeedStore.destroy();

        window.removeEventListener('scroll', this.props.FeedStore.handleScroll);
    }

    render() {
        return <>
            <NewPost />
            <div className="posts" onScroll={this.props.FeedStore.handleScroll}>
                { this.props.FeedStore.loadingPost 
                ? <>
                <div className="posts-placeholder card col-9 my-6">
                    <div className="text-placeholder my-4 mx-1"></div>
                    <div className="title-placeholder my-4 mx-1"></div>
                    <div className="description-placeholder my-2 mx-1"></div>
                    <div className="description-placeholder my-2 mx-1"></div>
                    <div className="description-placeholder my-2 mx-1"></div>
                </div>
                <div className="posts-placeholder card col-9 my-6">
                    <div className="text-placeholder my-4 mx-1"></div>
                    <div className="title-placeholder my-4 mx-1"></div>
                    <div className="description-placeholder my-2 mx-1"></div>
                    <div className="description-placeholder my-2 mx-1"></div>
                    <div className="description-placeholder my-2 mx-1"></div>
                </div>
                </>
                : <>{ this.props.FeedStore.posts.length > 0 
                ? <>
                { this.props.FeedStore.posts.map((post, key) => {
                    return <Post 
                                post={post} 
                                key={key} 
                                iter={key} 
                                userdata={this.props.FeedStore.userData}
                                togglePoint={this.props.FeedStore.togglePoint}  
                                authUser={this.props.FeedStore.userData.id} 
                                removePost={this.props.FeedStore.removePost}
                                isAuth={this.props.FeedStore.authStore.isAuth}
                                from="home" 
                            />
                    })
                }
                { this.props.FeedStore.last ? <div className="text-center f2 mb-8">There are no more posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div> : <div className="text-center f2 mb-8"><button className="btn btn-blue btn-squared p-4" onClick={this.props.FeedStore.handleScroll}>Load more posts</button></div>}
                </>
                : <div className="text-center f2">There are no posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div>
                }</>
                }
            </div>
            { this.props.FeedStore.isScrolled &&
                <ScrollTop />
            }
        </>;
    }
}

export default Feed;