import {observable, computed, runInAction} from 'mobx';

import {PostsStore} from './';

class ProfileStore extends PostsStore {
    constructor(){
        super("profile");
        this.getFollowers = this.authStore.getFollowers;
        this.getFollowing = this.authStore.getFollowing;
        this.putFollow = this.authStore.putFollow;
        this.deleteFollow = this.authStore.deleteFollow;
    }

    @observable profileData = {};
    @observable validProfile = false;

    @observable showFollowers = false;
    @observable showFollowing = false;

    @observable followers = [];
    @observable following = [];


    @computed get myProfile () {
        return this.profileData.id === this.authStore.userData.id;
    }
    
    componentMounted = async (profileName, callback) => {
        this.isLoading = true;
        this.destroy();
        let data = null;
        if (profileName) {
            data = await this.searchUser(profileName)
            if (data) this.profileId = data.id;
        } 
        else data = await this.searchUser(this.userData.username);

        runInAction(() => {
            if (data) if (!data.message) {
                this.profileData = data;
                this.validProfile = true;
            }
            this.isLoading = false;
        });

        await this.postsGet();

        if(typeof(callback) === "function") callback();
    }

    toggleFollowers = () => {
        this.showFollowers = !this.showFollowers;
    }

    toggleFollowing = () => {
        this.showFollowing = !this.showFollowing;
    }

    followClick = () => {
        if (this.myProfile && this.profileData.isFollowing) return;
        this.profileData.isFollowing = true;
        this.putFollow(this.profileData.id);
    }

    unfollowClick = () => {
        if (this.myProfile && !this.profileData.isFollowing) return;
        this.profileData.isFollowing = false;
        this.deleteFollow(this.profileData.id);
    }
    
    destroy = () => {
        this.posts = [];
        this.page = 1;
        this.ppp = 10;
        this.category = "all";
        this.last = false;
        this.loadingPost = false,
        this.profileId = null;
        this.isPrivate = false;
        this.showFollowers = false;
        this.showFollowing = false;
        this.following = [];
        this.followers = [];
    }

    searchUser = async(username) => {
        try { 
            const data = await this.getUserData(username);
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

}

export default new ProfileStore;