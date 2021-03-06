import React from 'react';
import {observer} from 'mobx-react';

type RadioType = {
    name?: string,
    form?: any,
    value?: string
}

export const RadioComponent = observer(({name, form, value}: RadioType) => 
    <div className="btn-radio">
        <input type="radio" {...form.$(name).bind({id: value, value: value, checked: value === form.$(name).value})}  />
        <label htmlFor={value}>   
            {value}    
        </label>
    </div>
);