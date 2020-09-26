import React from 'react';
import {observer} from 'mobx-react';

type CheckboxType = {
    name: string,
    form?: any,
    value: string
}

export const CheckboxComponent = observer(({name, form, value}: CheckboxType) => 
    <div className="btn-checkbox">
        <input type="checkbox" {...form.$(name).bind({id: value, value: value, onChange: () => {
            if(form.$(name).value.indexOf(value) === -1){
                return form.$(name).set([...form.$(name).value, value]);
            } else {
                return form.$(name).set([...form.$(name).value.filter(cat => cat != value)]);
            }}, checked: form.$(name).value.indexOf(value) !== -1})}  />
        <label htmlFor={value}>   
            {value}    
        </label>
    </div>
);