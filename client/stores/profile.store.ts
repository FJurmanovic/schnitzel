import {observable, computed, action} from 'mobx';

import {PostsStore, FullPostStore} from './';

class ProfileStore extends PostsStore {
    getFollowers: Function;
    getFollowing: Function;
    putFollow: Function;
    deleteFollow: Function;
    constructor(){
        super("profile");
        this.getFollowers = this.authStore.getFollowers;
        this.getFollowing = this.authStore.getFollowing;
        this.putFollow = this.authStore.putFollow;
        this.deleteFollow = this.authStore.deleteFollow;
    }

    @observable profileData: any = {};
    @observable validProfile: boolean = false;

    @observable showFollowers: boolean = false;
    @observable showFollowing: boolean = false;

    @observable followers: Array<any> = [];
    @observable following: Array<any> = [];
    

    @computed get myProfile (): boolean {
        return this.profileData.id === this.authStore.userData.id;
    }
    
    @computed get isAuth (): boolean {
        return this.authStore.isAuth;
    }
    
    @computed get postUsername (): string {
        if(FullPostStore.postObject) {
            return FullPostStore.postObject.username;
        } 
        return null;
    }

    @action componentMounted = async (profileName: string, callback?: Function): Promise<any> => {
        this.isLoading = true;
        this.destroy();
        let data: any = null;
        if(profileName !== this.profileId){
            if (profileName) {
                data = await this.searchUser(profileName)
            } 
            else data = await this.searchUser(this.userData.username);
        }
        if (data) if (!data.message) {
            this.profileData = data;
            this.validProfile = true;
        }
        this.isLoading = false;

        if(typeof(callback) === "function") callback();
    }

    @action toggleFollowers = (): void => {
        this.showFollowers = !this.showFollowers;
    }

    @action toggleFollowing = (): void => {
        this.showFollowing = !this.showFollowing;
    }

    @action followClick = (): void => {
        if (this.myProfile && this.profileData.isFollowing) return;
        this.profileData.isFollowing = true;
        this.putFollow(this.profileData.id);
    }

    @action unfollowClick = () => {
        if (this.myProfile && !this.profileData.isFollowing) return;
        this.profileData.isFollowing = false;
        this.deleteFollow(this.profileData.id);
    }
    
    @action destroy = (): void => {
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

    @action searchUser = async(username): Promise<any> => {
        try { 
            const data = await this.getUserData(username);
            if(data) {
                this.profileId = data.id;
                await this.postsGet();
            }
            return data;
        } catch (error) {
            console.log(error);
        }
    }

}

export default new ProfileStore;