import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';

import {App} from './components';
import {AuthStore, LoginStore, RegisterStore, EditProfileStore, PostsStore, ProfileStore, FormStore, FullPostStore} from './stores';
import {getTheme} from './common/js';

import './common/styles/Main.scss';
import './common/styles/Chevron.scss';
import './common/styles/Thorn.scss';

getTheme("get");

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
        NewPostStore={new FormStore("new")}
        EditPostStore={new FormStore("edit")}
        FullPostStore={FullPostStore}
    >
        <App />
    </Provider>;

ReactDOM.render(<Application />, document.getElementById('app'));