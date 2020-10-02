import React from 'react';
import { observer } from 'mobx-react';

type NewCommentType = {
    store: any
}

export const NewComment = observer(({store}: NewCommentType) => 
    <form onSubmit={(e) => store.submitClick(store.value, store.type, store.postId, store.commentId, e)} className="mb-8">
        <label>New comment: <br />
            <textarea 
                onChange={(e) => store.setValue(e.target.value)}
                value={store.value}
                className="width-full"
            />
        </label>
        <input type="submit" value="Submit" className="btn btn-blue px-6" />
    </form>
);