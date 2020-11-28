import React from 'react';
import {observer} from 'mobx-react';
import { FormGroupType } from 'Types';

const cloneElement: any = React.cloneElement;

export const FormGroupComponent = observer(({children, form, className}: FormGroupType) => 
    <div className={className}>
        {React.Children.map(children, child => {
            if (React.isValidElement(child) && (child.type !== "div" && child.type !== "span" && child.type !== "button"&& child.type !== "br")) {
                return cloneElement(child, {form})
            }
            return child;
        })}
    </div>
);