import React, {useState} from 'react';
import {Link} from 'react-router-dom';

export const Followers = ({type, ownerId, exitScreen, removeFromFollowers, removeFromFollowing, getFollowerFunction}) => {
    const stayHere = (event) => {
        event.stopPropagation();
    }

    const [list, setList] = useState([]);

    const [didFetch, setDidFetch] = useState(false);

    const getFollowerData = async () => {
        let data = await getFollowerFunction(ownerId);

        if(data) {
            setList(data || []);
            setDidFetch(true);
        }
        return;
    }

    if(!didFetch) getFollowerData();

    const firstUpper = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
      };

    return <div className="overlay" onClick={exitScreen}>
        <div className="followers" onClick={(e) => stayHere(e)}>
            <div className="flwrs">
                <div className="title">{firstUpper(type)}</div>
                {didFetch
                ?   <div className="list">
                        { list.map((follower, key) => 
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
} 