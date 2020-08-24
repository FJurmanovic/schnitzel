import {observable, computed, runInAction} from 'mobx';

import {PostsService, AuthService} from '../services';

import {PostsStore} from './';

class ProfileStore extends PostsStore {
    constructor(){
        super("profile");
    }

    @observable profileData = {};
    @observable validProfile = false;

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