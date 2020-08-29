import React, { useState } from 'react';

export const NewComment = ({type, postId, commentId, submitClick}) => {
    const [value, setValue] = useState("");
    
    return <form onSubmit={(e) => submitClick(value, type, postId, commentId, e)} className="mb-8">
        <label>New comment: <br />
            <textarea 
                onChange={(e) => setValue(e.target.value)}
                value={value}
                className="width-full"
            />
        </label>
        <input type="submit" value="Submit" className="btn btn-blue btn-squared px-6" />
    </form>
}