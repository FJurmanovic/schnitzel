import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import {categories} from '../common/js';

import {Ingredient, FormComponent, InputComponent, FileComponent, CheckboxComponent, FormGroupComponent, DropdownComponent, TextAreaComponent} from '../components';

import {FormsService} from '../services';
const fields = [
    {
        name: "title",
        type: "text",
        rules: "required|string|between:1,50"
    },
    {
        name: "type",
        value: "showoff",
        rules: "required"
    },
    {
        name: "privacy",
        value: "private",
        rules: "required"
    },
    {
        name: "image",
        type: "file",
        value: null,
    },
    {
        name: "categories",
        type: "checkbox",
        value: [],
        rules: "required"
    },
    {
        name: "description",
        rules: "required"
    },
    {
        name: "ingredients",
        value: [],
        rules: "required_if:type,recipe"
    },
    {
        name: "directions",
        rules: "required_if:type,recipe"
    }

]


const forms = new FormsService({fields});


@inject("EditPostStore")
@observer
class EditPost extends Component {
    constructor(props) {
        super(props);
        this.hooks = {
            onSuccess(form) {
                const file = form.$("image").files && form.$("image").files[0] || null;
                props.EditPostStore.submitClick(form.values(), file, props.history);
            },
            onError(form) {
              console.log(form.values())
            } 
          }
    }

    componentWillMount() {
        const {postId} = this.props.match.params;
        this.props.EditPostStore.getData(postId, forms);
    }
    
    goBack() {
        if (this.props.history.action == "PUSH") return this.props.history.goBack();
        return this.props.history.push("/");
    }

    render() {
        return <>
            { this.props.EditPostStore.showNew
            ?   <div className="new-post">
                    <FormComponent className="col-7 mx-auto" form={forms} onSubmit={(e) => forms.onSubmit(e, this.hooks)} onCancel={() => this.props.history.push("/")}>
                        <InputComponent className="width-full py-3 f4" message="Title: " errorMessage="Title must have between 1 and 50 characters" name="title" />
                        <DropdownComponent className="width-full f5 py-2 my-2" message="Type: " store={this.props.EditPostStore.typeStore} name="type" />
                        <DropdownComponent className="width-full f5 py-2 my-2" message="Privacy: " store={this.props.EditPostStore.privacyStore} name="privacy" />
                        <FileComponent message="Image: " name="image" />
                        <FormGroupComponent>
                            <div>Categories: </div>
                            {categories.map((category, key) => {
                                return <CheckboxComponent name="categories" value={category} key={key} />
                            })}
                        </FormGroupComponent>
                        <TextAreaComponent className="width-full py-3 f4" message="Description: " name="description" />
                        {this.props.EditPostStore.typeStore.textFieldName == "recipe" &&
                            <FormGroupComponent>
                                <FormGroupComponent className="ingredients">
                                    {forms.$("ingredients").value.map((_, i) =>
                                            <Ingredient key={i} i={i} name="ingredients" />           
                                    )}
                                </FormGroupComponent>
                                <br /><button className="btn btn-default mt-n4 mb-4" onClick={(e) => this.props.EditPostStore.addIngredientClick(e, forms.$("ingredients"))}>Add new ingredient</button><br />
                                <TextAreaComponent className="width-full py-3 f4" message="Directions: " name="directions" />
                            </FormGroupComponent>
                        }
                    </FormComponent>
                </div>
                :   <div>Loading</div>
                } 
            </>
    }
}

export default withRouter(EditPost);