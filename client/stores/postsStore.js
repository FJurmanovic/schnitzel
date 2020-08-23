import {observable, computed, runInAction} from 'mobx';

import {PostsService} from '../services';

import {AuthStore} from './';

class PostsStore {
    constructor () {
        this.postsService = new PostsService;
    }
    @observable feedPosts = [];
    @observable page = 1;
    @observable ppp = 1;
    @observable type = "feed";
    @observable category = "all";

    @observable last = false;

    @computed get totalCurrent () {
        return this.feedPosts.length;
    }

    @computed get userData () {
        return AuthStore.userData;
    }

    postsGet = async () => {
        if(!this.last) {
            let postsOptions = {
                "page": this.page,
                "ppp": this.ppp,
                "type": this.type,
                "category": this.category
            }
            try { 
                const data = await this.postsService.getPosts(AuthStore.token, postsOptions);
                runInAction(() => {
                    if(data.items){
                        if(this.page == 1) this.feedPosts = data.items;
                        else this.feedPosts.push(...data.items);
                        if (this.totalCurrent >= data.total){
                            this.last = true;
                        }
                        this.page++;
                    }
                })
            } catch (error) {
                console.log(error);
                runInAction(() => {
                    this.status = "error";
                });
            }
        }
    }
}

export default PostsStore;