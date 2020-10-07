import {observable, computed, action} from 'mobx';

import {PostsService, AuthService} from '../services';

import {AuthStore, CommentsStore} from './';
import PostsStore from './posts.store';

class FullPostStore {
    authStore: typeof AuthStore;
    postsService: PostsService;
    commentStore: CommentsStore;
    CommentsStore: typeof CommentsStore;
    removePost: Function;
    constructor () {
        this.authStore = AuthStore;
        this.postsService = new PostsService();
        this.commentStore = new CommentsStore("comment");
        this.CommentsStore = CommentsStore;
        this.removePost = new PostsStore("post").removePost;
    }
    @observable postObject: any = {};
    @observable showPost: boolean = false;
    @observable postId: string = null;

    @computed get isAuth (): boolean {
        return this.authStore.isAuth;
    }

    @action componentMounted = async (postId): Promise<void> => {
        this.postId = postId;
        try { 
            const data = await this.postsService.getPost(this.authStore.token, postId);
            if (data.id) {
                this.postObject = data;
                this.showPost = true;
            }                
        } catch (error) {
            console.log(error);
        }
    }

    @action toDefault = (): void => {
        this.postObject = {};
        this.showPost = false;
        this.postId = null;
        this.commentStore = new CommentsStore("comment");
    }

    @action submitClick = async(comment, type, postId, commentId, event): Promise<void> => {
        event.preventDefault();
        let object = {
            type,
            comment,
            postId,
            commentId: null
        };
        if(type === "reply") {
            object.commentId = commentId;
        }
        try { 
            const data =  await this.postsService.postComment(this.authStore.token, object);
            if(data) {
                location.reload();
            }
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    @action togglePoints = (): void => {
        if(this.postObject.isPointed) {
            this.postObject.points--;
            this.postObject.isPointed = false;
            this.postsService.deletePoint(this.authStore.token, this.postId, {type: "post"});
        } else {
            this.postObject.points++;
            this.postObject.isPointed = true;
            this.postsService.putPoint(this.authStore.token, this.postId, {type: "post"});
        }
    }

}

export default new FullPostStore;