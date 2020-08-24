import {observable, computed, runInAction} from 'mobx';

import {PostsService, AuthService} from '../services';

import {AuthStore} from './';

class PostsStore {
    constructor (type) {
        this.postsService = new PostsService;
        this.authService = new AuthService;
        this.authStore = AuthStore;
        this.type = type;
    }
    @observable posts = [];
    @observable page = 1;
    @observable ppp = 10;
    @observable category = "all";

    @observable last = false;

    @observable loadingPost = false;

    @observable profileName = null;

    @computed get firstDate () {
        if(this.posts.length > 0) return this.posts[0].createdAt
        
        return null;
    }

    @computed get totalCurrent () {
        return this.posts.length;
    }

    @computed get userData () {
        return this.authStore.userData;
    }

    setCategory = (category) => {
        this.destroy();
        this.category = category || "all";

    }

    handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        
        if (windowBottom >= docHeight && this.page > 1) {
            this.postsGet();
        }
    }

    destroy = () => {
        this.posts = [];
        this.page = 1;
        this.ppp = 10;
        this.category = "all";
        this.last = false;
    }

    postsGet = async (callback) => {
        if (this.page === 1) this.loadingPost = true;
        if(!this.last) {
            let postsOptions = {
                "page": this.page,
                "ppp": this.ppp,
                "type": this.type,
                "category": this.category
            }
            if (this.page !== 1) postsOptions.firstDate = this.firstDate;
            if (this.profileId) postsOptions.profileId = this.profileId;
            try { 
                const data = await this.postsService.getPosts(this.authStore.token, postsOptions);
                runInAction(() => {
                    if(data.items){
                        if(this.page == 1) this.posts = data.items;
                        else this.posts.push(...data.items);
                        if (this.totalCurrent >= data.total){
                            this.last = true;
                        } else this.page++;
                        this.loadingPost = false;
                    }
                    if(typeof(callback) === "function") callback();
                })
            } catch (error) {
                console.log(error);
                runInAction(() => {
                    this.status = "error";
                });
            }
        }
    }

    getUserData = async (username) => {
        try { 
            const data = await this.authService.getUserData(username, this.authStore.token);
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    addPoint = async (id, type) => {
        try { 
            const data = await this.postsService.putPoint(this.authStore.token, id, type);
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    removePoint = async (id, type) => {
        try { 
            const data = await this.postsService.deletePoint(this.authStore.token, id, type);
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }

    }
}

export default PostsStore;