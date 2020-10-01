import { observer } from 'mobx-react';
import * as React from 'react';

export const Toast = observer(({store}) => 
    <>
        {store.toasts.length > 0 && <div className="toasts">
            {store.toasts.map((toast, key) => 
                <div key={key} className="toast" style={{borderColor: toast.color}}>
                    <span className="toast-text" title={toast.text}>{toast.text}</span>
                    <button className="toast-remove btn btn-icon" onClick={() => store.remove(key)}><i className="gg-close"></i></button>
                </div>
            )}
        </div>}
    </>
);