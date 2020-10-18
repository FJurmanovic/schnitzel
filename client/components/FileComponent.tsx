import React from 'react';
import {observer} from 'mobx-react';

type FileType = {
    message?: string,
    errorMessage?: string,
    name?: string,
    form?: any,
    className?: string,
    onChange?: any
}

export const FileComponent = observer(({message, errorMessage, name, form, className, onChange}: FileType) => 
    <div>
        <label>
            {message && <div>{message}</div>}
            <input className={className} {...form.$(name).bind()} onChange={onChange} />
            {form.$(name).error && <div className="h5 text-red">{errorMessage}</div>}
        </label>
    </div>
);