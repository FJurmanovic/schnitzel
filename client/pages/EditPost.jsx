import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import {firstUpper, categories} from '../common/js';

import { Ingredient } from '../components';


@inject("EditPostStore")
@observer
class EditPost extends Component {
    componentWillMount() {
        const {postId} = this.props.match.params;
        this.props.EditPostStore.getData(postId);
    }

    componentWillUnmount() {
        this.props.EditPostStore.toDefault();
    }
    
    goBack() {
        if (this.props.history.action == "PUSH") return this.props.history.goBack();
        return this.props.history.push("/");
    }

    render() {
        return <>
            { this.props.EditPostStore.showNew
            ?   <div className="new-post">
                    <button className="btn btn-link float-right mr-9 mt-n3" onClick={this.goBack.bind(this)}>Cancel</button>
                    <form onSubmit={(e) => this.props.EditPostStore.submitClick(e, this.props.history)} className="col-7 mx-auto" method="post">
                        <label>Title:<br />
                            <input type="text" value={this.props.EditPostStore.titleValue || ""} onChange={(e) => this.props.EditPostStore.titleChange(e.target.value)} className="width-full py-3 f4" required />
                            { this.props.EditPostStore.err.title &&
                                <small className="h5 text-red d-block">{this.props.EditPostStore.err.title}</small>
                            }
                        </label>
                        <br />
                        <label>Type:<br />
                            <select onChange={(e) => this.props.EditPostStore.typeChange(e.target.value)} className="width-full py-3 f4">
                                <option value="post">Showoff</option>
                                <option value="recipe">Recipe</option>
                            </select>
                        </label>
                        <br />
                        <label>Post privacy:<br />
                            <select onChange={(e) => this.props.EditPostStore.privacyChange(e.target.value)} className="width-full py-3 f4">
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>
                        </label>
                        <br />
                        <label>Image:<br />
                            <input type="file" onChange={(e) => this.props.EditPostStore.imageChange(e.target.files[0])} />
                        </label>
                        <br />
                        <div className="f4">Category:<br /> 
                            {categories.map((category, key) => {
                                return <React.Fragment key={key}>
                                    <div className="btn-checkbox">
                                        <input type="checkbox" name={category} id={category} checked={this.props.EditPostStore.categoriesValue.filter(x => x == category)[0] || false} onChange={(e) => this.props.EditPostStore.categoryChange(e)} value={category} />
                                        <label htmlFor={category}> {firstUpper(category)}</label>
                                    </div>
                                </React.Fragment>   
                            })}
                            { this.props.EditPostStore.err.categories &&
                                <small className="h5 text-red d-block">{this.props.EditPostStore.err.categories}</small>
                            }
                        </div>
                        <br />
                        <label>Description:<br />
                            <textarea 
                                onChange={(e) => this.props.EditPostStore.descriptionChange(e.target.value)}
                                value={this.props.EditPostStore.descriptionValue || ""}
                                className="width-full py-3 f4"
                                required
                            />
                            { this.props.EditPostStore.err.description &&
                                <small className="h5 text-red d-block">{this.props.EditPostStore.err.description}</small>
                            }
                        </label>
                        <br />
                        {this.props.EditPostStore.typeValue == "recipe" &&
                        <>
                            <label>Ingredients:<br /></label>
                            <div className="ingredients">
                                {this.props.EditPostStore.ingredientsValue.map((ingredient, i) => {
                                    return ( <>
                                        <Ingredient err={this.props.EditPostStore.err.ingredient} key={i} ingredient={ingredient} i={i} ingredientNameChange={this.props.EditPostStore.ingredientNameChange} ingredientAmountChange={this.props.EditPostStore.ingredientAmountChange} ingredientUnitChange={this.props.EditPostStore.ingredientUnitChange} />
                                        { this.props.EditPostStore.err.ingredients && <>
                                        { this.props.EditPostStore.err.ingredients[i] && <small className="h5 text-red d-block">{this.props.EditPostStore.err.ingredients[i]}</small> }
                                        </>
                                        }
                                    </>
                                )})}
                            </div>
                            <br />
                            <button className="btn btn-default mt-n4 mb-4" onClick={(e) => this.props.EditPostStore.addIngredientClick(e)}>Add new ingredient</button><br />
                            <label className="">Directions:<br />
                                <textarea 
                                    onChange={(e) => this.props.EditPostStore.directionsChange(e.target.value)}
                                    value={this.props.EditPostStore.directionsValue || ""}
                                    className="width-full py-3 f4"
                                    required
                                />
                            </label>
                            <br />
                        </>
                        }
                        <input type="submit" value="Submit" className="btn btn-blue width-full" />
                    </form>
                </div>
                :   <div>Loading</div>
                } 
            </>
    }
}

export default withRouter(EditPost);