import React from 'react';
import {observer} from 'mobx-react';

type FileType = {
    message?: string,
    errorMessage?: string,
    name?: string,
    form?: any,
    className?: string,
    onChange?: any,
    selectedFile?: any
}

export const FileComponent = observer(({message, errorMessage, name, form, className, onChange, selectedFile}: FileType) => 
    <div>
        <label>
            {message && <div>{message}</div>}
            <label className={`${className ? className + " " : ""}file-input${selectedFile ? " selected" : ""}`}>
                {selectedFile ? <span>Image selected...</span> : <span>Upload image...</span>}
                <input {...form.$(name).bind()} onChange={onChange} />
            </label>
            {form.$(name).error && <div className="h5 text-red">{errorMessage}</div>}
        </label>
    </div>
);