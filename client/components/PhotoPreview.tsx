import React from 'react';
import { observer } from 'mobx-react';

const PhotoPreview = (props) => {
    const {
        store,
        id,
        src
    } = props;

    const {
        selectedFile,
        unloadPhoto
    } = store;

    return <React.Fragment>
        <div className="card-image">
            <img id={id} className="card-img-top" style={{display: src ? "inline-block" : "none"}} src={src} />
        </div>
        {selectedFile && 
            <button 
                onClick={(e) => unloadPhoto(e)}
                className="btn btn-red my-2"
            >Remove selected image</button>
        }
    </React.Fragment>
}

export default observer(PhotoPreview);