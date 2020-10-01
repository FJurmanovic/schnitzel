import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import {observer} from 'mobx-react';

type SearchType = {
    className?: string,
    store?: any,
}

export const SearchComponent = observer(({className, store}: SearchType) =>
    {
        useEffect(() => {
            document.addEventListener("click", (event: any) => {
                if(event.target.className == "search-custom-search") return;
                store.closeDropdown()
            });
            return () => {
                document.removeEventListener("click", () => store.closeDropdown());
            }
        });
        const history = useHistory();

        return  <div className="search-custom" onClick={(event) => event.stopPropagation()}>
            <div className={`search-custom-top ${className || ""} ${store.isOpen ? "--open" : ""}`}>
                <input className="search-custom-search" placeholder="Search" type="text" value={store.searchPhrase} onClick={store.openDropdown} onChange={(e) => store.phraseChange(e.target.value)} />
            </div>
            {store.isOpen &&
            <div className={`search-custom-open ${className || ""}`}>
                <ul className="search-custom-list">
                    {store.fieldArray.map((field, key) => 
                        <li key={key} className="search-custom-listitem" onClick={() => {
                            store.textChange(field.title, key);
                            if(field.type === "user") {
                                history.push(`/${field.title}`);
                            } else {
                                history.push(`/post/${field.id}`);
                            }
                        }}><span className="item-text" title={field.title}>{field.title}</span><span className={`item-icon ${field.type === "user" ? "gg-user" : "gg-file-document"}`}></span></li>
                    )}
                    {store.isEmpty && <li className="text-gray-darker">Nothing found</li>}
                </ul>
            </div>
            }
        </div>
    }
);