import React from 'react';
import { inject, observer } from 'mobx-react';
import {categories} from '../common/js';

import {Ingredient, FormComponent, InputComponent, FileComponent, CheckboxComponent, FormGroupComponent, DropdownComponent, TextAreaComponent} from './';

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


const forms: any = new FormsService({fields});

interface NewPostProps {
    NewPostStore?: any,
    history?: any
}

@inject("NewPostStore")
@observer
class NewPost extends React.Component<NewPostProps> {
    hooks: any;

    constructor(props) {
        super(props);
        this.hooks = {
            onSuccess(form) {
                const file = form.$("image").files && form.$("image").files[0] || null;
                props.NewPostStore.submitClick(form.values(), file, props.history);
            },
            onError(form) {
            console.log(form.values())
            } 
        }
    }
    render() {
        return <>
            { this.props.NewPostStore.showNew
            ?   <div className="new-post">
                    <FormComponent className="col-7 mx-auto" form={forms} onSubmit={(e) => forms.onSubmit(e, this.hooks)} onCancel={this.props.NewPostStore.toggleShow}>
                        <InputComponent className="width-full py-3 f4" message="Title: " errorMessage="Title must have between 1 and 50 characters" name="title" />
                        <DropdownComponent className="width-full f5 py-2 my-2" message="Type: " store={this.props.NewPostStore.typeStore} name="type" />
                        <DropdownComponent className="width-full f5 py-2 my-2" message="Privacy: " store={this.props.NewPostStore.privacyStore} name="privacy" />
                        <FileComponent message="Image: " name="image" />
                        <FormGroupComponent>
                            <div>Categories: </div>
                            {categories.map((category, key) => {
                                return <CheckboxComponent name="categories" value={category} key={key} />
                            })}
                        </FormGroupComponent>
                        <TextAreaComponent className="width-full f5" message="Description: " name="description" />
                        {forms.$("type").value == "recipe" &&
                            <FormGroupComponent>
                                <FormGroupComponent className="ingredients">
                                    {forms.$("ingredients").value.map((_, i) =>
                                            <Ingredient key={i} i={i} name="ingredients" />           
                                    )}
                                </FormGroupComponent>
                                <br /><button className="btn btn-default mt-n4 mb-4" onClick={(e) => this.props.NewPostStore.addIngredientClick(e, forms.$("ingredients"))}>Add new ingredient</button><br />
                                <TextAreaComponent className="width-full f5" message="Directions: " name="directions" />
                            </FormGroupComponent>
                        }
                    </FormComponent>
                </div>
                :   <button className="btn btn-blue-transparent d-block width-full py-4 border-blue" onClick={this.props.NewPostStore.toggleShow}>New Post</button>
                } 
            </>
    }
}

export default NewPost;