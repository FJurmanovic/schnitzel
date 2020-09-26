import React from 'react';
import {observer} from 'mobx-react';

type FormType = {
    onSubmit?: any,
    onCancel?: any,
    children?: Array<any>,
    form?: any,
    className?: string
}

const cloneElement: any = React.cloneElement;

export const FormComponent = observer(({onSubmit, onCancel, children, form, className}: FormType) => 
    <form onSubmit={onSubmit} className={className}>
        {React.Children.map(children, child => {
            if (React.isValidElement(child) && (child.type !== "div" && child.type !== "span" && child.type !== "button" && child.type !== "br")) {
                return cloneElement(child, { form })
            }
            return child;
        })}
        <div className="my-3">
            <input className="btn btn-blue mr-2" type="submit" value="Submit" onSubmit={onSubmit} />
            <input className="btn btn-red-transparent border-red ml-2" type="button" value="Cancel" onClick={onCancel} />
        </div>
    </form>
);