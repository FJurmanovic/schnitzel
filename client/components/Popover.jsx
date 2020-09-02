import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthService} from '../services';
import {AuthStore} from '../stores';

export const Popover = ({userId, username, getUserData, iter}) => {
    const authService = new AuthService;
    const authStore = AuthStore;

    const [authorData, setAuthorData] = useState(
        {
            id: '',
            postNum: 0,
            username: username
        }
    );

    const [isFetch, setIsFetch] = useState(false);
    
    const getAuthorData = async(username) => {
        if(!isFetch){
            
            let data = await authService.getUserData(username, authStore.token);
            if(data) {
                setAuthorData(data);
                setIsFetch(true);
            }
        }
    }

    return <>
        {username == "DeletedUser" 
        ? <span>DeletedUser</span>
        : <Link className="f5" onMouseOver={() => getAuthorData(username)} to={`/${username}`}>{username}</Link>
        }
        {isFetch &&
            <Link className="popover-author" to={`/${username}`}>
                <div className="" id={`popover_${iter}`}>
                    <div className="md-photo">
                        {authorData.hasPhoto ? <img src={authorData.url} className="card-img-top" /> : <img src="https://storage.googleapis.com/schnitzel/default.jpg" className="card-img-top" />} 
                        <span className="author-user">{username}</span>
                        <span className="author-post">Posts: {authorData.postNum}</span>
                    </div>
                </div>
            </Link>
        }
    </>
} 