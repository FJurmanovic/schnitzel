import {observable, computed, runInAction} from 'mobx';

import {PostsService, AuthService} from '../services';

import {PostsStore} from './';

class ProfileStore extends PostsStore {
    constructor(){
        super("profile");
    }

    @observable profileData = {};
    @observable validProfile = false;
    @observable isLoading = false;
    
    componentMounted = async (profileName, callback) => {
        this.isLoading = true;
        let data = null;
        if (profileName) data = await this.searchUser(profileName) 
        else data = await this.searchUser(this.userData.username);
        
        await this.postsGet();

        runInAction(() => {
            if (!data.message) {
                this.profileData = data;
                this.validProfile = true;
            }
        });

        this.isLoading = false;
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