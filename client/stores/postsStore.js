import {observable, computed, runInAction} from 'mobx';

import {PostsService, AuthService} from '../services';

import {AuthStore} from './';

class PostsStore {
    constructor (type) {
        this.postsService = new PostsService;
        this.authService = new AuthService;
        this.type = type;
    }
    @observable posts = [];
    @observable page = 1;
    @observable ppp = 1;
    @observable category = "all";

    @observable last = false;

    @observable loadingPost = false;

    @computed get totalCurrent () {
        return this.posts.length;
    }

    @computed get userData () {
        return AuthStore.userData;
    }

    setCategory = (category) => {
        this.feedPosts = [];
        this.page = 1;
        this.ppp = 10;
        this.last = false;
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
            try { 
                const data = await this.postsService.getPosts(AuthStore.token, postsOptions);
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

    getUserData = async (id) => {
        try { 
            const data = await this.authService.getUserData(id, AuthStore.token);
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
            const data = await this.postsService.putPoint(AuthStore.token, id, type);
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
            const data = await this.postsService.deletePoint(AuthStore.token, id, type);
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