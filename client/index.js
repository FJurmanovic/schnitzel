import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';

import {App} from './components';
import {AuthStore, LoginStore, RegisterStore, EditProfileStore, PostsStore, ProfileStore, NewPostStore} from './stores';

import './common/styles/Main.scss';
import './common/styles/Chevron.scss';
import './common/styles/Thorn.scss';

const Application = () => 
    <Provider
        AuthStore={AuthStore}
        LoginStore={LoginStore}
        RegisterStore={RegisterStore}
        EditProfileStore={EditProfileStore}
        FeedStore={new PostsStore("feed")}
        ExploreStore={new PostsStore("explore")}
        ExploreCategoryStore={new PostsStore("explore")}
        ProfileStore={ProfileStore}
        NewPostStore={NewPostStore}
    >
        <App />
    </Provider>;

ReactDOM.render(<Application />, document.getElementById('app'));