import React from 'react';
import {observer} from 'mobx-react';

type InputType = {
    message?: string,
    errorMessage?: string,
    name?: string,
    form?: any,
    className?: string,
    autoFocus?: boolean
}

export const InputComponent = observer(({message, errorMessage, name, form, className, autoFocus}: InputType) => 
    <div>
        <label>
            {message && <div>{message}</div>}
            <input className={className} {...form.$(name).bind()} autoFocus={autoFocus} />
            {form.$(name).error && <div className="h5 text-red">{errorMessage}</div>}
        </label>
    </div>
);