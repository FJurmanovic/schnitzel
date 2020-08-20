import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {withRouter} from 'react-router-dom';

@inject("LoginStore")
@observer
class Login extends Component {
    render() {
        return (
            <div>
                <form onSubmit={(e) => this.props.LoginStore.submitClick(e, this.props.history)} className="mx-auto col-7 f4">
                    <label>Email:<br />
                        <input type="email" value={this.props.LoginStore.emailValue || ''} onChange={(e) => this.props.LoginStore.emailChange(e.target.value)} className="width-full f5 py-2" required autoFocus />
                    </label>
                    <br />
                    <label>Password:<br />
                        <input type="password" value={this.props.LoginStore.passwordValue || ''} onChange={(e) => this.props.LoginStore.passwordChange(e.target.value)} className="width-full f5 py-2" required />
                    </label>
                    <br />
                    <input type="submit" className="my-3 width-full btn btn-blue-transparent border-blue" value="Login" />
                </form>
            </div>
        );
    }
}

export default withRouter(Login);