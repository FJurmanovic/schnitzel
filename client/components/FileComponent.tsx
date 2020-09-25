import React from 'react';
import {observer} from 'mobx-react';

export const FileComponent = observer(({message, errorMessage, name, form, className}) => 
    <div>
        <label>
            {message && <div>{message}</div>}
            <input className={className} {...form.$(name).bind()} />
            {form.$(name).error && <div className="h5 text-red">{errorMessage}</div>}
        </label>
    </div>
);