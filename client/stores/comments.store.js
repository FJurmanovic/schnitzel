import {observable, computed, runInAction} from 'mobx';
import {AuthStore} from './';
import {PostsService} from '../services';

class CommentsStore {
    constructor(type, data) {
        this.type = type;
        this.commentData = data;
        this.postsService = new PostsService;
        this.authStore = AuthStore;
    }

    @observable comments = [];
    @observable postId = null;
    @observable commentId = null;
    @observable page = 1;
    @observable ppp = 10;

    @observable loadingPost = false;

    @observable showReply = null;
    openReply = (id) => {
        if(this.showReply === id) this.showReply = null;
        else this.showReply = id;
    }

    @computed get firstDate () {
        if(this.comments.length > 0) return this.comments[0].createdAt
        
        return null;
    }

    @computed get totalCurrent () {
        return this.comments.length;
    }

    togglePoints = (id) => {
        let commentKey = this.comments.map((x) => x.id).indexOf(id);
        let object = {
            type: this.type,
        };

        if(this.type == "comment") {
            object.commentId = id;
        }else if (this.type == "reply") {
            object.commentId = this.commentId;
            object.replyId = id;
        }
        if (this.comments[commentKey].isPointed) {
            this.comments[commentKey].points--;
            this.comments[commentKey].isPointed = false;
            this.postsService.deletePoint(this.authStore.token, this.postId, object);

        } else {
            this.comments[commentKey].points++;
            this.comments[commentKey].isPointed = true;
            this.postsService.putPoint(this.authStore.token, this.postId, object);

        }
        console.log(this.type, this.postId, this.commentId, id);
        console.log()
        console.log(this.comments[0].id)
    }

    setId = (postId, commentId, hasComments) => {
        this.postId = postId || null;
        this.commentId = commentId || null;

        if(this.type === "comment" && this.postId || this.type === "reply" && this.postId && this.commentId) {
            hasComments && this.getComments();
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
            let data = await this.postsService.getComment(this.authStore.token, params);
            runInAction(() => {
                if(data.items){
                    if(this.type === "comment") {
                        for(const [key, comment] of data.items.entries()) {
                            data.items[key].store = new CommentsStore("reply", comment);
                        }
                    }
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