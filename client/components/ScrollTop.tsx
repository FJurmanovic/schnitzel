import React from 'react';

import { scrollToTop } from '../common/js';

export default function () {
    return <div className="scroll-top" onClick={scrollToTop}>
            <span className="noselect gg-chevron-up"></span>
        </div>
}