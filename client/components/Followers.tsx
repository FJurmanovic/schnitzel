import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import { observer } from 'mobx-react';
import {firstUpper} from '../common/js';
import { Popover } from './';
import { PopoverStore } from '../stores';

type FollowersType = {
    type?: string,
    store?: any,
    exitScreen?: any,
    history?: any
}

export const Followers = withRouter(observer(({type, store, exitScreen, history}: FollowersType) => 
    <div className="overlay" onClick={exitScreen}>
        <div className="followers" onClick={(e) => store.stayHere(e)}>
            <div className="flwrs">
                <div className="title">{firstUpper(type)}</div>
                {store.didFetch
                ?   <div className="list">
                        { store.list.map((follower, key) => 
                            <React.Fragment key={key}>
                                <div>
                                    <Popover store={new PopoverStore} username={follower.username}>
                                        <span onClick={(e) => history.push(`/${follower.username}`)}>
                                            <li className="flw-li mx-3 my-2">
                                                <span>{follower.username}</span>
                                            </li>
                                        </span>
                                    </Popover>
                                </div>
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
));