import React from 'react';
import {Link} from 'react-router-dom';
import { observer } from 'mobx-react';

type PopoverType = {
    store: any,
    username?: string,
    iter?: number,
    children?: any
}

export const Popover = observer(({store, username, iter, children}: PopoverType) => 
    <>
        { children
        ? <div className="pop" onMouseOver={() => store.getAuthorData(username)}>{children}</div>
        : username != "DeletedUser" 
            ? <Link className="f5" onMouseOver={() => store.getAuthorData(username)} to={`/${username}`}>{username}</Link>
            : <span>Deleted User</span>
        }
        {store.isFetch &&
            <Link className="popover-author" to={`/${username}`}>
                <div className="" id={`popover_${iter}`}>
                    <div className="md-photo">
                        {store.authorData.hasPhoto ? <img src={store.authorData.url} className="card-img-top" /> : <img src="https://storage.googleapis.com/schnitzel/default.jpg" className="card-img-top" />} 
                        <span className="author-user">{username}</span>
                        <span className="author-post">Posts: {store.authorData.postNum}</span>
                    </div>
                </div>
            </Link>
        }
    </>
); 