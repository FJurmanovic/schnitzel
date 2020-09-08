import React from 'react';
import { observer } from 'mobx-react';

export const Switch = observer(({store}) => 
    <div className="d-inline-block swc">
        <div aria-checked={store.enabled} className="switch" onClick={store.toggleClick}>
            <div className="toggle"></div>
        </div>
    </div>
);