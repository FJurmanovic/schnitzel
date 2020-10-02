import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {withRouter} from 'react-router-dom';

import {FormComponent, InputComponent} from '../components';

import {FormsService} from '../services';
const fields = [
    {
        name: "email",
        type: "email",
        rules: "required|string|between:1,50"
    },
    {
        name: "password",
        type: "password",
        rules: "required|between: 3,15"
    }
]


const forms:any = new FormsService({fields});

type LoginProps = {
    LoginStore?: any;
    history?: any
}

@inject("LoginStore")
@observer
class Login extends Component<LoginProps> {
    hooks: any;
    constructor(props) {
        super(props); 
        this.hooks = {
            onSuccess(form) {
                props.LoginStore.submitClick(form.values(), props.history);
            },
            onError(form) {
            } 
        }
    }
    componentWillUnmount() {
        forms.reset();
    }

    render() {
        return (
            <div className="text-center">
                <FormComponent className="mx-auto col-7 f4" form={forms} onSubmit={(e) => forms.onSubmit(e, this.hooks)} onCancel={() => this.props.history.push("/")}>
                    <InputComponent className="width-full f5 py-2 my-2" message="Email: " errorMessage="Wrong email format." name="email" autoFocus />
                    <InputComponent className="width-full f5 py-2 my-2" message="Password (3-15 characters): " errorMessage="Password must be between 3 and 15 characters." name="password" />
                </FormComponent>
                {this.props.LoginStore.errorMessage && <div className="mx-auto col-7 h4 text-red">{this.props.LoginStore.errorMessage}</div>}
            </div>
        );
    }
}

export default withRouter(Login);