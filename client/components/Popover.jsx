import React from 'react';
import {Link} from 'react-router-dom';
import { observer } from 'mobx-react';

export const Popover = observer(({store, username, iter}) => 
    <>
        {username == "DeletedUser" 
        ? <span>DeletedUser</span>
        : <Link className="f5" onMouseOver={() => store.getAuthorData(username)} to={`/${username}`}>{username}</Link>
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