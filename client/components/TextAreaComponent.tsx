import React from 'react';
import {observer} from 'mobx-react';

type TextAreaType = {
    message?: string,
    errorMessage?: string,
    name?: string,
    form?: any,
    className?: string,
    autoFocus?: boolean
}

export const TextAreaComponent = observer(({message, errorMessage, name, form, className, autoFocus}: TextAreaType) => 
    <div>
        <label>
            {message && <div>{message}</div>}
            <textarea className={className} {...form.$(name).bind()} autoFocus={autoFocus} />
            {form.$(name).error && <div className="h5 text-red">{errorMessage}</div>}
        </label>
    </div>
);