import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, withRouter} from 'react-router-dom';

import {Landing, Login, Register, EditProfile, Feed, Explore, ExploreCategory, Profile, EditPost, FullPost} from '../pages';
import {Navbar, Toast} from './';

import {ToastStore} from '../stores';

import { observer, inject } from 'mobx-react';

interface DemoProps {
    store: any,
    history: any
}

interface AppProps {
    AuthStore: any
}

const closeDetails = function() {
    let menu = document.getElementById("profile");
    if (menu) menu.removeAttribute("open");
}

class DemoLogin extends Component<DemoProps> {
    componentWillMount() {
        this.props.store.authLogin(
            {
                "email": "demo@demo.com",
                "password": "demoacc"
            }, this.props.history);
    }
    render() {
        return <div>Logging into Demo Account</div>
    }
}

const DemoLoginWithRouter = withRouter(DemoLogin);

const AppRouter = ({store, auth}) =>
    <Router>
        <div className="App" onClick={closeDetails}>
            <Navbar />
            <div className="container">
                <Switch>
                    <Route exact path="/">
                        { auth ? <Feed /> : <Landing /> }
                    </Route>
                    <Route path="/explore/f/:categoryId">
                        { auth ? <ExploreCategory /> : <Redirect to="/login" /> }
                    </Route>
                    <Route path="/explore/:any">
                        <Redirect to="/explore" />
                    </Route>
                    <Route path="/explore">
                        { auth ? <Explore /> : <Redirect to="/login" /> }
                    </Route>
                    <Route path="/login">
                        { auth ? <Redirect to="/" /> : <Login /> }
                    </Route>
                    <Route path="/register">
                        { auth ? <Redirect to="/" /> : <Register /> }
                    </Route>
                    <Route path="/demologin">
                        {
                            auth 
                            ? <Redirect to="/" />   
                            : <DemoLoginWithRouter store={store} />
                        }
                    </Route>
                    <Route path="/logout">
                        <Logout authLogout={store.authLogout} />
                    </Route>
                    <Route path="/profile/edit">
                        { auth ? <EditProfile /> : <Redirect to="/" /> }
                    </Route>
                    <Route path="/profile">
                        { auth ? <Profile /> : <Redirect to="/" /> }
                    </Route>
                    <Route path="/post/edit/:postId">
                        { auth ? <EditPost /> : <Redirect to="/" /> }
                    </Route>
                    <Route path="/post/:postId/3">
                        { auth 
                        ? <>
                            <ExploreCategory />
                            <FullPost />
                          </> 
                        : <Redirect to="/" /> 
                        }
                    </Route>
                    <Route path="/post/:postId/2">
                        { auth 
                        ? <>
                            <Explore />
                            <FullPost />
                          </> 
                        : <Redirect to="/" /> 
                        }
                    </Route>
                    <Route path="/post/:postId/1">
                        { auth 
                        ? <>
                            <Profile />
                            <FullPost />
                          </> 
                        : <Redirect to="/" /> 
                        }
                    </Route>
                    <Route path="/post/:postId">
                        { auth 
                        ? <>
                            <Feed />
                            <FullPost />
                          </> 
                        : <Redirect to="/" /> 
                        }
                    </Route>
                    <Route path="/post">
                        <Redirect to="/" />
                    </Route>
                    <Route path="/:profileName">
                        { auth ? <Profile /> : <Redirect to="/" /> }
                    </Route>
                </Switch>
            </div>
        </div>
    </Router>

const Logout = ({authLogout}) => {
    return <div>Logging out {authLogout() && <Redirect to="/" />} </div>
}

@inject("AuthStore")
@observer
class App extends Component<AppProps> {
    componentWillMount() {
        this.props.AuthStore.authorize();
    }

    render() {
        return (
            <>
                {this.props.AuthStore.passedData &&
                    <AppRouter store={this.props.AuthStore} auth={this.props.AuthStore.isAuth} />
                }
                <Toast store={ToastStore} />
            </>
        );
    }
}

export default App;