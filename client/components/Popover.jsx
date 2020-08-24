import React, {useState} from 'react';
import {Link} from 'react-router-dom';

export const Popover = ({userId, username, getUserData, iter}) => {
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
            
            let data = await getUserData(username);
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
                        {authorData.hasPhoto ? <img src={`https://storage.googleapis.com/schnitzel/avatar/${authorData.id}/${authorData.id}${authorData.photoExt}`} className="card-img-top" /> : <img src="https://storage.googleapis.com/schnitzel/default.jpg" className="card-img-top" />} 
                        <span className="author-user">{username}</span>
                        <span className="author-post">Posts: {authorData.postNum}</span>
                    </div>
                </div>
            </Link>
        }
    </>
} 