import {observable, computed, runInAction} from 'mobx';

import {PostsService, AuthService} from '../services';

import {AuthStore, CommentsStore} from './';

class FullPostStore {
    constructor () {
        this.authStore = AuthStore;
        this.postsService = new PostsService();
        this.commentStore = new CommentsStore("comment");
        this.CommentsStore = CommentsStore;
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

    toDefault = () => {
        this.postObject = {};
        this.showPost = false;
        this.postId = null;
    }

    submitClick = async(comment, type, postId, commentId, event) => {
        event.preventDefault();
        let object = {
            type,
            comment,
            postId
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
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    togglePoints = () => {
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