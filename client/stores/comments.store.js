import {observable, computed, runInAction} from 'mobx';
import {AuthStore} from './';
import {PostsService} from '../services';

class CommentsStore {
    constructor(type) {
        this.type = type;
        this.postsService = new PostsService;
        this.authStore = AuthStore;
    }

    @observable comments = [];
    @observable postId = null;
    @observable commentId = null;
    @observable page = 1;
    @observable ppp = 10;

    @observable loadingPost = false;

    @computed get firstDate () {
        if(this.comments.length > 0) return this.comments[0].createdAt
        
        return null;
    }

    @computed get totalCurrent () {
        return this.comments.length;
    }


    setId = (postId, commentId) => {
        this.postId = postId || null;
        this.commentId = commentId || null;

        if(this.type === "comment" && this.postId || this.type === "reply" && this.postId && this.commentId) {
            this.getComments();
        }
    }

    getComments = async () => {
        let params = {
            page: this.page,
            ppp: this.ppp,
            postId: this.postId
        };
        if (this.type === "comment"){
            params.type = this.type;
        } else if (this.type === "reply"){
            params.type = this.type;
            params.commentId = this.commentId
        }
        try { 
            const data = await this.postsService.getComment(this.authStore.token, params);
            runInAction(() => {
                if(data.items){
                    if(this.page == 1) this.comments = data.items;
                    else this.comments.push(...data.items);
                    if (this.totalCurrent >= data.total){
                        this.last = true;
                    } else this.page++;
                    this.loadingPost = false;
                }
                if(data.status == 403) this.isPrivate = true;
                else this.isPrivate = false;
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

export default CommentsStore;