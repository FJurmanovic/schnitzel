import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {withRouter} from 'react-router-dom';

import {FormComponent, InputComponent, RadioComponent, FormGroupComponent, DropdownComponent} from '../components';

import {FormsService} from '../services';
import { RegisterProps } from 'Types';

const fields = [
    {
        name: "username",
        type: "text",
        rules: "required|string|between:1,10"
    },
    {
        name: "email",
        type: "email",
        rules: "required|string|between:1,50"
    },
    {
        name: "emailConfirm",
        type: "email",
        rules: "required|string|same:email"
    },
    {
        name: "password",
        type: "password",
        rules: "required|between: 3,15"
    },
    {
        name: "passwordConfirm",
        type: "password",
        rules: "required|same:password"
    },
    {
      name: "privacy",
      type: "radio",
      rules: "required",
      default: "Private",
      value: "Private"
    },
    {
      name: "categories",
      type: "checkbox",
      rules: "required",
      value: []
    }
]

const forms:any = new FormsService({fields});

@inject("RegisterStore")
@observer
class Register extends Component<RegisterProps> {
    hooks: any;
    constructor(props) {
      super(props);
      this.hooks = {
        onSuccess(form) {
          props.RegisterStore.submitClick(form.values(), props.history);
        },
        onError(form) {
          console.log(form.values())
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
                <InputComponent className="width-full f5 py-2 my-2" message="Username (1-10 characters): " errorMessage="Username must have between 1 and 10 characters." name="username" autoFocus />
                <InputComponent className="width-full f5 py-2 my-2" message="Email: " errorMessage="Wrong email format." name="email" />
                <InputComponent className="width-full f5 py-2 my-2" message="Confirm Email: " errorMessage="The e-mails do not match." name="emailConfirm" />
                <FormGroupComponent className="my-2">
                  <div>Profile privacy:</div>
                  <RadioComponent name="privacy" value="Private" />
                  <RadioComponent name="privacy" value="Public" />
                </FormGroupComponent>
                <InputComponent className="width-full f5 py-2 my-2" message="Password (3-15 characters): " errorMessage="Password must be between 3 and 15 characters." name="password" />
                <InputComponent className="width-full f5 py-2 my-2" message="Confirm Password: " errorMessage="Passwords do not match." name="passwordConfirm" />
            </FormComponent>
            {this.props.RegisterStore.errorMessage && <div className="mx-auto col-7 h4 text-red">{this.props.RegisterStore.errorMessage}</div>}
          </div>
        );
    }
}

export default withRouter(Register);