import {observable, computed, runInAction} from 'mobx';

import {PostsService, AuthService} from '../services';

import {AuthStore} from './';

class FullPostStore {
    constructor () {
        this.authStore = AuthStore;
        this.postsService = new PostsService();
    }
    @observable postObject = {};
    @observable showPost = false;
    @observable postId = null;

    componentMounted = async (postId) => {
        this.postId = postId;
        try { 
            const data = await this.postsService.getPost(this.authStore.token, postId);
            runInAction(() => {
                if (data.id) {
                    this.postObject = data;
                    this.showPost = true;
                }                
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }
}

export default new FullPostStore;