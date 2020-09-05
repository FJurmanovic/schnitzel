import React from 'react';
import {observer} from 'mobx-react';

export const TextAreaComponent = observer(({message, errorMessage, name, form, className, autoFocus}) => 
    <div>
        <label>
            {message && <div>{message}</div>}
            <textarea className={className} {...form.$(name).bind()} autoFocus={autoFocus} />
            {form.$(name).error && <div className="h5 text-red">{errorMessage}</div>}
        </label>
    </div>
);