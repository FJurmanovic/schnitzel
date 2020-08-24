import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Post } from '../components';

@inject("ProfileStore")
@observer
class Profile extends Component {
    componentWillMount() {
        let { profileName } = this.props.match.params;
        this.props.ProfileStore.componentMounted(profileName, () => {
            if (this.props.ProfileStore.myProfile && profileName) this.props.history.push("/profile");
        });
        window.addEventListener('scroll', this.props.ProfileStore.handleScroll);
    }

    componentWillUnmount() {
        this.props.ProfileStore.destroy();
        window.removeEventListener('scroll', this.props.ProfileStore.handleScroll);
    }

    componentDidUpdate(prevProps) {
        let { profileName } = this.props.match.params;
        window.removeEventListener('scroll', this.props.ProfileStore.handleScroll);
        if (profileName !== prevProps.match.params.profileName) {
            this.props.ProfileStore.componentMounted(profileName, () => {
                if (this.props.ProfileStore.myProfile && profileName) this.props.history.push("/profile");
                window.addEventListener('scroll', this.props.ProfileStore.handleScroll)
            });
        }
    }

    render() {
        return <> {!this.props.ProfileStore.isLoading && <>
            { this.props.ProfileStore.validProfile ? 
            <div onScroll={this.props.ProfileStore.handleScroll}>
                <div>
                    <div className="profile-image mx-auto text-center">{this.props.ProfileStore.profileData.hasPhoto ? <img src={`https://storage.googleapis.com/schnitzel/avatar/${this.props.ProfileStore.profileData.id}/${this.props.ProfileStore.profileData.id}${this.props.ProfileStore.profileData.photoExt}`} className="card-img-top" /> : <img src="https://storage.googleapis.com/schnitzel/default.jpg" className="card-img-top" />}</div>
                    <div className="mx-auto text-center">
                    <ul className="d-inline-block m-3 text-left">
                        <button className="btn btn-blue-transparent btn-rounder border-blue d-inline-block" onClick={() => this.setState({showFollowers: true})}>Followers</button>
                    </ul>
                    <ul className="d-inline-block m-3 text-left">
                        <button className="btn btn-blue-transparent btn-rounder border-blue" onClick={() => this.setState({showFollowing: true})}>Following</button>
                    </ul>
                    </div>
                    <div>
                        <h1 className="text-center">{this.props.ProfileStore.profileData.username}</h1>
                    </div>
                    { !this.props.ProfileStore.myProfile && <>{
                        this.props.ProfileStore.profileData.isFollowing
                        ?   <div className="mx-auto text-center">
                                <button className="btn btn-orange btn-rounder px-11 folbtn" onClick={this.handleUnfollowButton}>Unfollow</button>
                            </div>
                        :   <div className="mx-auto text-center">
                                <button className="btn btn-lightgreen btn-rounder folbtn" onClick={this.handleFollowButton}>Follow</button>
                            </div>
                    }</>}
                    { (this.props.ProfileStore.myProfile || !this.props.ProfileStore.isPrivate) 
                        ?  <>{this.props.ProfileStore.loadingPost 
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
                            : <>{this.props.ProfileStore.posts.map((post, key) => <Post
                                post={post} 
                                key={key} 
                                iter={key} 
                                userdata={this.props.ProfileStore.userData}
                                addPoint={this.props.ProfileStore.addPoint} 
                                removePoint={this.props.ProfileStore.removePoint} 
                                authUser={this.props.ProfileStore.userData.id} 
                                getUserData={this.props.ProfileStore.getUserData} 
                                from="profile" 
                            />)}</>
                            }</>
                        :   <div className="mx-auto text-center my-5 h2">This profile is private.</div>
                    } { !this.props.ProfileStore.isPrivate && <>{ this.props.ProfileStore.last 
                    ?   <div className="text-center f2 mb-8">There are no more posts to load. <br /> 
                        <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div> 
                    :   <div className="text-center f2 mb-8">
                            <button className="btn btn-blue btn-squared p-4" onClick={this.handleNewPosts}>Load more posts</button>
                        </div>
                    } </> }
                </div>
            </div>
            : <div className="mx-auto text-center my-10 h2">User could not be found.</div>
        }</> } </>
    }
}

export default withRouter(Profile);