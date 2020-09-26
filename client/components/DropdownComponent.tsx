import React from 'react';
import {observer} from 'mobx-react';

type DropdownType = {
    className?: string,
    message?: string,
    errorMessage?: string,
    store?: any,
    form?: any,
    name?: string
}

export const DropdownComponent = observer(({className, message, errorMessage, store, form, name}: DropdownType) =>
    <div>
        <label onClick={store.openDropdown}>
            {message && <div>{message}</div>}
            <div className="dropdown-custom" onClick={(event) => event.stopPropagation()}>
                <div className={`dropdown-custom-top ${className || ""} ${store.isOpen ? "--open" : ""}`} onClick={store.toggleDropdown}>
                    <span className="dropdown-custom-fieldname">{form.$(name).value || "Select"}</span>
                </div>
                <input {...form.$(name).bind({value: store.textFieldName, type: "hidden"})} />
                {store.isOpen &&
                <div className={`dropdown-custom-open ${className || ""}`}>
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
            {form.$(name).error && <div className="h5 text-red">{errorMessage}</div>}
        </label>
    </div>
);