import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';

import { firstUpper, categories } from '../common/js';

import { Post, ScrollTop } from '../components';

type ExploreCategoryProps = {
    ExploreCategoryStore?: any;
    match?: any;
}

@inject("ExploreCategoryStore")
@observer
class ExploreCategory extends Component<ExploreCategoryProps> {
    componentWillMount() {
        this.props.ExploreCategoryStore.setCategory(this.props.match.params.categoryId);
        this.props.ExploreCategoryStore.postsGet();
        window.addEventListener('scroll', this.props.ExploreCategoryStore.handleScroll);
    }

    componentWillUnmount() {
        this.props.ExploreCategoryStore.destroy();

        window.removeEventListener('scroll', this.props.ExploreCategoryStore.handleScroll);
    }

    componentDidUpdate(prevProps) {
        window.removeEventListener('scroll', this.props.ExploreCategoryStore.handleScroll);
        if (this.props.match.path !== prevProps.match.path) return;
        if (this.props.match.params.categoryId !== prevProps.match.params.categoryId) {
            this.props.ExploreCategoryStore.setCategory(this.props.match.params.categoryId);
            this.props.ExploreCategoryStore.postsGet(() => window.addEventListener('scroll', this.props.ExploreCategoryStore.handleScroll));
            ;
        }
    }

    render() {
        return <>
            <div className="d-flex">
                <div className="d-inline-block mx-auto">
                    <Link className="btn category-btn btn-rounder mx-1 my-1" to={`/explore`}>All</Link>
                    {categories.map((category, key) => {
                        return <React.Fragment key={key}>
                            <Link className={`btn category-btn ${category === this.props.match.params.categoryId && "-pressed" }  btn-rounder mx-1 my-1`} to={`/explore/f/${category}`}>{firstUpper(category)}</Link>
                        </React.Fragment>
                    })}
                </div>
            </div>
            
            <hr />

            <div className="posts" onScroll={this.props.ExploreCategoryStore.handleScroll}>
                { this.props.ExploreCategoryStore.loadingPost 
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
                : <>{ this.props.ExploreCategoryStore.posts.length > 0 
                ? <>
                { this.props.ExploreCategoryStore.posts.map((post, key) => {
                    return <Post 
                                post={post} 
                                key={key} 
                                iter={key} 
                                userdata={this.props.ExploreCategoryStore.userData} 
                                togglePoint={this.props.ExploreCategoryStore.togglePoint}  
                                authUser={this.props.ExploreCategoryStore.userData.id} 
                                removePost={this.props.ExploreCategoryStore.removePost}
                                isAuth={this.props.ExploreCategoryStore.authStore.isAuth}
                                from="explore-category" 
                            />
                    })
                }
                { this.props.ExploreCategoryStore.last ? <div className="text-center f2 mb-8">There are no more posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div> : <div className="text-center f2 mb-8"><button className="btn btn-blue btn-squared p-4" onClick={this.props.ExploreCategoryStore.handleScroll}>Load more posts</button></div>}
                </>
                : <div className="text-center f2">There are no posts to load. <br /> <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div>
                }</>
                }
            </div>
            { this.props.ExploreCategoryStore.isScrolled &&
                <ScrollTop />
            }
        </>;
    }
}

export default withRouter(ExploreCategory);