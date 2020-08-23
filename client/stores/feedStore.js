import {observable, computed} from 'mobx';
import {AuthStore, PostsStore} from './';

class FeedStore {
    constructor() {
        this.postsStore = new PostsStore("feed");
        this.getUserData = this.postsStore.getUserData;
        this.handleScroll = this.postsStore.handleScroll;
        this.getPosts = this.postsStore.postsGet;
        this.destroy = this.postsStore.destroy;
    }

    @computed get loadingPost () {
        return this.postsStore.loadingPost;
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
}

export default new FeedStore;