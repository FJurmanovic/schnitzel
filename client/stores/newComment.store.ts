import {observable, action} from 'mobx';

class NewCommentStore {
    type: string;
    postId: string;
    commentId: string;
    submitClick: Function;
    constructor(type, postId, commentId, submitClick) {
        this.type = type;
        this.postId = postId;
        this.commentId = commentId;
        this.submitClick = submitClick;
    }
    @observable value: string = "";

    @action setValue = (value): string => this.value = value;
}

export default NewCommentStore;