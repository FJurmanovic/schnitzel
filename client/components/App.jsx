import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import {Landing, Login} from '../pages';
import { observer, inject } from 'mobx-react';

const AppRouter = ({auth}) => 
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
                    </Route>
                </Switch>
            </div>
        </div>
    </Router>

@inject("AuthStore")
@observer
class App extends Component {
    componentWillMount() {
        this.props.AuthStore.authorize();
    }

    render() {
        return (
            <div>
                <AppRouter auth={this.props.AuthStore.isAuth} />
            </div>
        );
    }
}

export default App;