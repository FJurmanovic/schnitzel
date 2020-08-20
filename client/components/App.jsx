import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import {Landing, Login} from '../pages';
import { observer, inject } from 'mobx-react';

const AppRouter = ({auth, authLogout}) => 
    <Router>
        <div className="App">
            <div className="container">
                <Switch>
                    <Route exact path="/">
                        <Landing />
                    </Route>
                    <Route path="/login">
                        {auth ? <Redirect to="/" /> : console.log(auth)}
                        <Login />
                    </Route>
                    <Route path="/logout">
                        <Logout authLogout={authLogout} />
                    </Route>
                </Switch>
            </div>
        </div>
    </Router>

const Logout = ({authLogout}) => {
    authLogout();
    return <Redirect to="/" />
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
                <AppRouter auth={this.props.AuthStore.isAuth} authLogout={this.props.AuthStore.authLogout} />
            </div>
        );
    }
}

export default App;