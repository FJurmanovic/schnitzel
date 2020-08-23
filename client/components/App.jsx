import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import {Landing, Login, Register, EditProfile, Feed, Explore, ExploreCategory} from '../pages';
import {Navbar} from './';
import { observer, inject } from 'mobx-react';

const AppRouter = ({store, auth}) => 
    <Router>
        <div className="App">
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
                        { auth ? () => {console.log(store.isAuth, store); return <Redirect to="/" />} : () => {console.log(store.isAuth, store.userData); return <Login />} }
                    </Route>
                    <Route path="/register">
                        { auth ? <Redirect to="/" /> : <Register /> }
                    </Route>
                    <Route path="/logout">
                        <Logout authLogout={store.authLogout} />
                    </Route>
                    <Route path="/profile/edit">
                        { auth ? <EditProfile /> : <Redirect to="/" /> }
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
class App extends Component {
    componentWillMount() {
        this.props.AuthStore.authorize();
    }

    render() {
        return (
            <div>
                {this.props.AuthStore.passedData &&
                    <AppRouter store={this.props.AuthStore} auth={this.props.AuthStore.isAuth} />
                }
            </div>
        );
    }
}

export default App;