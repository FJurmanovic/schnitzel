import {observable, computed, action} from 'mobx';
import {AuthStore} from './';
import {PostsService} from '../services';

type CommentObject = {
    comment: string,
    createdAt: Date,
    id: string,
    isDeleted: boolean,
    isPointed: boolean,
    points: number,
    timeago: string,
    userId: string,
    username: string,
    last?: boolean
}

type CommentType = Array<CommentObject>;

type CommentObjectType = {
    type: string,
    postId?: string,
    commentId?: string,
    replyId?: string,
    comment?: string
}

type ParamsType = {
    page: number,
    ppp: number,
    postId?: string,
    type?: string,
    commentId?: string
}

class CommentsStore {
    type: string;
    commentData: CommentType;
    postsService: PostsService;
    authStore: typeof AuthStore;

    constructor(type, data?) {
        this.type = type;
        this.commentData = data;
        this.postsService = new PostsService;
        this.authStore = AuthStore;
    }

    @observable comments: CommentType = [];
    @observable postId: string = null;
    @observable commentId: string = null;
    @observable page: number = 1;
    @observable ppp: number = 10;

    @observable commentEdit: string = null;

    @observable loadingPost: boolean = false;

    @observable isEditing: number = null;

    @observable last: boolean = false;
    @observable isPrivate: boolean = false;
    
    @action editClick = (key: number): void => {
        if(this.isEditing === key) this.isEditing = null;
        else this.isEditing = key;
        this.commentEdit = null;
    }
    @action saveEdit = (type: string, replyId: string, commentId: string, postId: string): void => {
        if(this.commentEdit === null) {
            event.preventDefault();
            return this.editClick(null);
        }
        this.putComment(type, replyId, commentId, postId, this.commentEdit);
    }
    @action editChange = (value: string): void => {
        this.commentEdit = value;
    }

    @observable showReply = null;
    @action openReply = (id: string): void => {
        if(this.showReply === id) this.showReply = null;
        else this.showReply = id;
    }

    @computed get firstDate (): Date {
        if(this.comments.length > 0) return this.comments[0].createdAt
        
        return null;
    }

    @computed get totalCurrent (): number {
        return this.comments.length;
    }

    @action deleteComment = async (id: string): Promise<void> => {
        let object: CommentObjectType = {
            type: this.type,
            postId: this.postId
        };

        if(this.type == "comment") {
            object.commentId = id;
        }else if (this.type == "reply") {
            object.commentId = this.commentId;
            object.replyId = id;
        }
        const data = await this.postsService.deleteComment(this.authStore.token, object);
        if(data) {
            location.reload();
        }
    }
    @action putComment = async (type: string, replyId: string, commentId: string, postId: string, comment: string): Promise<any> => {
        let object: CommentObjectType = {
            type: type,
            postId: postId,
            comment: comment
        };

        if(this.type == "comment") {
            object.commentId = replyId;
        }else if (this.type == "reply") {
            object.commentId = commentId;
            object.replyId = replyId;
        }
        const data = await this.postsService.putComment(this.authStore.token, object);
        return data;
    }

    @action togglePoints = (id: string): void => {
        let commentKey = this.comments.map((x) => x.id).indexOf(id);
        let object: CommentObjectType = {
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
    }

    @action setId = (postId: string, commentId:string, hasComments: boolean): void => {
        this.postId = postId || null;
        this.commentId = commentId || null;
        if(this.type === "comment" && this.postId || this.type === "reply" && this.postId && this.commentId) {
            if(hasComments) this.getComments();
            else this.last = true;
        }
    }


    @action getComments = async (callback?: Function): Promise<void> => {
        let params: ParamsType = {
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
        } catch (error) {
            console.log(error);
        }
    }
}

export default CommentsStore;