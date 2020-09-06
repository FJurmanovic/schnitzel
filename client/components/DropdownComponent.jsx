import React from 'react';
import {observer} from 'mobx-react';

export const DropdownComponent = observer(({store, form, name}) =>
    <div className="dropdown-custom">
        <div className={`dropdown-custom-top ${store.isOpen ? "--open" : ""}`} onClick={store.toggleDropdown}>
            <span className="dropdown-custom-fieldname">{form.$(name).value || "Select"}</span>
        </div>
        <input {...form.$(name).bind({value: store.textFieldName, type: "hidden"})} />
        {store.isOpen &&
        <div className="dropdown-custom-open">
            <input className="dropdown-custom-search" type="text" value={store.searchPhrase} onChange={(e) => store.phraseChange(e.target.value)} autoFocus />
            <ul className="dropdown-custom-list">
                {store.fieldArray.map((field, key) => 
                    <li key={key} className="dropdown-custom-listitem" onClick={() => {
                        form.$(name).value = field;
                        store.textChange(field, key);
                    }}>{field}</li>
                )}
            </ul>
        </div>
        }
    </div>
);