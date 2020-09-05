import React from 'react';
import {observer} from 'mobx-react';

export const DropdownComponent = observer(({store}) =>
    <div className="dropdown-custom">
        <span className="dropdown-custom-fieldname" onClick={store.toggleDropdown}>{store.textFieldName}</span>
        {store.isOpen &&
        <div className="dropdown-custom-open">
            <input className="dropdown-custom-search" type="text" value={store.searchPhrase} onChange={(e) => store.phraseChange(e.target.value)} />
            <ul className="dropdown-custom-list">
                {store.fieldArray.map((field, key) => 
                    <li key={key} className="dropdown-custom-listitem">{field}</li>
                )}
            </ul>
        </div>
        }
    </div>
);