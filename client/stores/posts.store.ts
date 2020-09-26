import {observable, computed, action} from 'mobx';

import {PostsService, AuthService} from '../services';

import {AuthStore} from './';

type UserType = {
    username: string,
    url?: string,
    isPrivate: boolean,
    id: string,
    hasPhoto?: boolean,
    following: any[],
    followers: any[],
    email: string,
    createdAt: Date
} | {id?: string, username?: string}

type PostOption = {
    page: number,
    ppp: number,
    type: string,
    category: string,
    firstDate?: Date,
    profileId?: string
}

class PostsStore {
    postsService: PostsService;
    authService: AuthService;
    authStore: typeof AuthStore;
    type: string;
    constructor (type) {
        this.postsService = new PostsService;
        this.authService = new AuthService;
        this.authStore = AuthStore;
        this.type = type;
    }
    @observable posts: Array<any> = [];
    @observable page: number = 1;
    @observable ppp: number = 10;
    @observable category: string = "all";

    @observable last: boolean = false;

    @observable loadingPost: boolean = false;
    @observable isLoading: boolean = false;

    @observable profileId: string = null;
    @observable isPrivate: boolean = false;


    @computed get firstDate (): Date {
        if(this.posts.length > 0) return this.posts[0].createdAt
        
        return null;
    }

    @computed get totalCurrent (): number {
        return this.posts.length;
    }

    @computed get userData (): UserType {
        return this.authStore.userData;
    }

    @action setCategory = (category): void => {
        this.destroy();
        this.category = category || "all";

    }

    handleScroll = (): void => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        
        if (windowBottom >= docHeight && this.page > 1) {
            this.postsGet();
        }
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
    }

    removePost = async (id): Promise<void> => {
        try { 
            if(window.confirm("Are you sure you want to remove a post?")){
                const data = await this.postsService.deletePost(this.authStore.token, id);
                return data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    @action postsGet = async (callback?: Function): Promise<void> => {
        if (this.page === 1) this.loadingPost = true;
        if(!this.last) {
            let postsOptions: PostOption = {
                "page": this.page,
                "ppp": this.ppp,
                "type": this.type,
                "category": this.category,
            }
            if (this.page !== 1) postsOptions.firstDate = this.firstDate;
            if (this.profileId) postsOptions.profileId = this.profileId;
            try { 
                const data = await this.postsService.getPosts(this.authStore.token, postsOptions);
                if(data.items){
                    if(this.page == 1) this.posts = data.items;
                    else this.posts.push(...data.items);
                    if (this.totalCurrent >= data.total){
                        this.last = true;
                    } else this.page++;
                    this.loadingPost = false;
                }
                if(data.status == 403) this.isPrivate = true;
                else this.isPrivate = false;
                if(typeof(callback) === "function") callback();
            } catch (error) {
                console.log(error);
            }
        }
    }

    getUserData = async (username: string): Promise<any> => {
        try { 
            const data = await this.authService.getUserData(username, this.authStore.token);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    addPoint = async (id: string, type: string): Promise<any> => {
        let object = {
            type
        }
        try { 
            const data = await this.postsService.putPoint(this.authStore.token, id, object);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    removePoint = async (id: string, type: string): Promise<any> => {
        let object = {
            type
        }
        try { 
            const data = await this.postsService.deletePoint(this.authStore.token, id, object);
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    togglePoint = (id: string, type: string): void => {
        const key = this.posts.map((post, _) => post.id).indexOf(id);
        if(type === "post") {
            if(this.posts[key].isPointed){
                this.removePoint(id, type);
                this.posts[key].isPointed = false;
                this.posts[key].points--;
            } else {
                this.addPoint(id, type);
                this.posts[key].isPointed = true;
                this.posts[key].points++;
            }
        }
    }
}

export default PostsStore;