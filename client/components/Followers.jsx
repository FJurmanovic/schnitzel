import React from 'react';
import {Link} from 'react-router-dom';
import { observer } from 'mobx-react';
import {firstUpper} from '../common/js';

export const Followers = observer(({type, store, exitScreen}) => 
    <div className="overlay" onClick={exitScreen}>
        <div className="followers" onClick={(e) => store.stayHere(e)}>
            <div className="flwrs">
                <div className="title">{firstUpper(type)}</div>
                {store.didFetch
                ?   <div className="list">
                        { store.list.map((follower, key) => 
                            <React.Fragment key={key}>
                                <span onClick={(e) => exitScreen(e)}><li className="flw-li mx-3 my-2"><span><Link to={`/${follower.username}`}>{follower.username}</Link></span></li></span>
                            </React.Fragment>
                        )}
                    </div>
                :   <div className="list-placeholder">
                        <div className="item-placeholder"></div>
                        <div className="item-placeholder"></div>
                        <div className="item-placeholder"></div>
                        <div className="item-placeholder"></div>
                        <div className="item-placeholder"></div>
                        <div className="item-placeholder"></div>
                        <div className="item-placeholder"></div>
                        <div className="item-placeholder"></div>
                        <div className="item-placeholder"></div>
                    </div>
                }
            </div>
        </div>
    </div>
);