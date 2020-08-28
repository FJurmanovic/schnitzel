import React, { useState } from 'react';

export const Switch = ({curr, onClick }) => {
    const [enabled, setEnabled] = useState(curr);

    const toggleClick = (e) => {
        setEnabled(!enabled);
        onClick(e, !enabled);
    }

    return <div className="d-inline-block swc">
        <div aria-checked={enabled} className="switch" onClick={toggleClick}>
            <div className="toggle"></div>
        </div>
    </div>
}