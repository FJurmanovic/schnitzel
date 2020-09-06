import React from 'react';
import {observer} from 'mobx-react';

export const FormComponent = observer(({onSubmit, onCancel, children, form, className}) => {
    return <form onSubmit={onSubmit} className={className}>
        {React.Children.map(children, child => {
            if (React.isValidElement(child) && (child.type !== "div" && child.type !== "span" && child.type !== "button" && child.type !== "br")) {
                return React.cloneElement(child, {form})
            }
            return child;
        })}
        <div className="my-3">
            <input className="btn btn-blue mr-2" type="submit" value="Submit" onSubmit={onSubmit} />
            <input className="btn btn-red-transparent border-red ml-2" type="button" value="Cancel" onClick={onCancel} />
        </div>
    </form>
});