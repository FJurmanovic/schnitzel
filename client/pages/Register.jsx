import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {withRouter} from 'react-router-dom';

@inject("RegisterStore")
@observer
class Register extends Component {
    render() {
        return (
            <div className="text-center">
            <form onSubmit={(e) => this.props.RegisterStore.submitClick(e, this.props.history)} className="col-7 mx-auto f4">
                <label>Username(max. 10):<br />
                  <input type="username" value={this.props.RegisterStore.usernameValue || ""} onChange={(e) => this.props.RegisterStore.usernameChange(e.target.value)} className="width-full f5 py-2" required autoFocus />
                </label>
                <label>Email:<br />
                  <input type="email" value={this.props.RegisterStore.emailValue || ""} onChange={(e) => this.props.RegisterStore.emailChange(e.target.value)} className="width-full f5 py-2" required />
                </label>
                <label>Confirm Email:<br />
                  <input type="email" value={this.props.RegisterStore.email2Value || ""} onChange={(e) => this.props.RegisterStore.email2Change(e.target.value)} className="width-full f5 py-2" required />
                </label>
                <label>Password:<br />
                <input type="password" value={this.props.RegisterStore.passwordValue || ""} onChange={(e) => this.props.RegisterStore.passwordChange(e.target.value)} className="width-full f5 py-2" required />
                </label>
                <br />
                <label>Confirm Password:<br />
                  <input type="password" value={this.props.RegisterStore.password2Value || ""} onChange={(e) => this.props.RegisterStore.password2Change(e.target.value)} className="width-full f5 py-2" required />
                </label>
                <label>Profile privacy:<br />
                  <label className="mx-2">Private <input type="radio" value="private" checked={this.props.RegisterStore.privacy === "private"} onChange={(e) => this.props.RegisterStore.privacyChange(e.target.value)}/></label>
                  <label className="mx-2">Public <input type="radio" value="public" checked={this.props.RegisterStore.privacy === "public"} onChange={(e) => this.props.RegisterStore.privacyChange(e.target.value)}/></label>
                  <br />
                </label>
                <input type="submit" value="Register" className="width-full f3 btn btn-blue-transparent border-blue" />
            </form>
          </div>
        );
    }
}

export default withRouter(Register);