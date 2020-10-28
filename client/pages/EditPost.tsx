import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import {categories, loadPhoto} from '../common/js';

import {Ingredient, FormComponent, InputComponent, FileComponent, CheckboxComponent, FormGroupComponent, DropdownComponent, TextAreaComponent, PhotoPreview} from '../components';

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

type EditPostProps = {
    EditPostStore?: any;
    match?: any;
    history?: any;
}


@inject("EditPostStore")
@observer
class EditPost extends Component<EditPostProps> {
    hooks: any;
    constructor(props) {
        super(props);
        this.hooks = {
            onSuccess(form) {
                const file = props.EditPostStore.selectedFile || null;
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
    componentWillUnmount() {
        forms.reset();
    }
    
    goBack() {
        if (this.props.history.action == "PUSH") return this.props.history.goBack();
        return this.props.history.push("/");
    }

    render() {
        return <>
            { this.props.EditPostStore.showNew
            ?   <div className="new-post">
                    <FormComponent className="col-9 mx-auto" form={forms} onSubmit={(e) => forms.onSubmit(e, this.hooks)} onCancel={() => this.props.history.push("/")}>
                        <InputComponent className="width-full py-3 f4" message="Title: " errorMessage="Title must have between 1 and 50 characters" name="title" />
                        <DropdownComponent className="width-full f5 py-2 my-2" message="Type: " store={this.props.EditPostStore.typeStore} name="type" />
                        <DropdownComponent className="width-full f5 py-2 my-2" message="Privacy: " store={this.props.EditPostStore.privacyStore} name="privacy" />
                        <PhotoPreview id="editPhoto" store={this.props.EditPostStore} src={this.props.EditPostStore.imgUrl} />
                        <FileComponent message="Image: " name="image" onChange={(e) => this.props.EditPostStore.loadPhoto(e)} selectedFile={this.props.EditPostStore.selectedFile} />
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
                                <br /><button className="btn btn-default mt-n4 mb-4" onClick={(e) => this.props.EditPostStore.addIngredientClick(e, forms.$("ingredients"))}>Add new ingredient</button><br />
                                <TextAreaComponent className="width-full f5" message="Directions: " name="directions" />
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