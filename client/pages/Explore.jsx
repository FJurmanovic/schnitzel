import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import { Post } from '../components/Post';

@inject("ExploreStore")
@observer
class Explore extends Component {
    componentWillMount() {
        this.props.ExploreStore.postsGet();

        window.addEventListener('scroll', this.props.ExploreStore.handleScroll);
    }

    componentWillUnmount() {
        this.props.ExploreStore.destroy();

        window.removeEventListener('scroll', this.props.ExploreStore.handleScroll);
    }

    render() {
        return (
            <div className="posts" onScroll={this.props.ExploreStore.handleScroll}>
                { this.props.ExploreStore.loadingPost 
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
                : <>{ this.props.ExploreStore.posts.length > 0 
                ? <>
                { this.props.ExploreStore.posts.map((post, key) => {
                    return <Post 
                                post={post} 
                                key={key} 
                                iter={key} 
                                userdata={this.props.ExploreStore.userData} 
                                addPoint={this.props.ExploreStore.addPoint} 
                                removePoint={this.props.ExploreStore.removePoint} 
                                authUser={this.props.ExploreStore.userData.id} 
                                dataByUsername={this.props.ExploreStore.getUserData} 
                                from="explore" 
                            />
                    })
                }
                { this.props.ExploreStore.last ? <div className="text-center f2 mb-8">There are no more posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div> : <div className="text-center f2 mb-8"><button className="btn btn-blue btn-squared p-4" onClick={this.props.ExploreStore.handleScroll}>Load more posts</button></div>}
                </>
                : <div className="text-center f2">There are no posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div>
                }</>
                }
            </div>
        );
    }
}

export default Explore;