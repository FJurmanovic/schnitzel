import React from 'react';
import {observer} from 'mobx-react';

export const FormGroupComponent = observer(({children, form, className}) => 
    <div className={className}>
        {React.Children.map(children, child => {
            if (React.isValidElement(child) && (child.type !== "div" && child.type !== "span" && child.type !== "button"&& child.type !== "br")) {
                return React.cloneElement(child, {form})
            }
            return child;
        })}
    </div>
);