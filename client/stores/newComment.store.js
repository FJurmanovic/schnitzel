import {observable, action} from 'mobx';

class NewCommentStore {
    constructor(type, postId, commentId, submitClick) {
        this.type = type;
        this.postId = postId;
        this.commentId = commentId;
        this.submitClick = submitClick;
    }
    @observable value = "";

    @action setValue = (value) => this.value = value;
}

export default NewCommentStore;