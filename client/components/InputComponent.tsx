import React from 'react';
import {observer} from 'mobx-react';
import { InputType } from 'Types';

export const InputComponent = observer(({message, errorMessage, name, form, className, autoFocus}: InputType) => 
    <div>
        <label>
            {message && <div>{message}</div>}
            <input className={className} {...form.$(name).bind()} autoFocus={autoFocus} />
            {form.$(name).error && <div className="h5 text-red">{errorMessage}</div>}
        </label>
    </div>
);