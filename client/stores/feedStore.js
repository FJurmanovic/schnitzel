import {observable, computed} from 'mobx';
import {AuthStore, PostsStore} from './';

class FeedStore {
    constructor() {
        this.postsStore = new PostsStore;
    }

    @computed get posts () {
        return this.postsStore.feedPosts;
    };

    @computed get userData () {
        return AuthStore.userData;
    }

    @computed get last () {
        return this.postsStore.last;
    }

    getPosts = () => {
        this.postsStore.postsGet();
    }

    handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        
        if (windowBottom >= docHeight) {
            this.postsStore.postsGet();
        }
    }

    destroy() {
        this.postsStore.feedPosts = [];
        this.postsStore.page = 1;
        this.postsStore.ppp = 10;
        this.postsStore.type = "feed";
        this.postsStore.category = "all";
        this.postsStore.last = false;
    }
}

export default new FeedStore;