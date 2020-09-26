import React from 'react';
import {observer} from 'mobx-react';

type IngredientType = {
    form?: any,
    i: number,
    name: string 
}

export const Ingredient = observer(({form, i, name}: IngredientType) => 
    <div className="ingredient">
        {form.$(name).value[i] && <>
            <input className="ingr-item" {...form.$(name).bind({id: `ing-name-${i}`, type: "text", value: form.$(name).value[i].name, onChange: (e) => form.$(name).value[i].name = e.target.value, placeholder: "Ingredient"})} />
            <input className="ingr-item" {...form.$(name).bind({id: `ing-amount-${i}`, type: "number", value: form.$(name).value[i].amount, onChange: (e) => form.$(name).value[i].amount = e.target.value, placeholder: "Amount"})} />
            <input className="ingr-item" {...form.$(name).bind({id: `ing-unit-${i}`, type: "text", value: form.$(name).value[i].unit, onChange: (e) => form.$(name).value[i].unit = e.target.value, placeholder: "Unit"})} />
        </>}
    </div>
)