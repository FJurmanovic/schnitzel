import React from 'react';
import { inject, observer } from 'mobx-react';
import {firstUpper, categories} from '../common/js';

const Ingredient = ({ingredient, i, ingredientNameChange, ingredientAmountChange, ingredientUnitChange}) => {
    const [name, setName] = React.useState(ingredient.name);
    const [amount, setAmount] = React.useState(ingredient.amount);
    const [unit, setUnit] = React.useState(ingredient.unit);

    return <div className="ingredient">
        <input className="ingr-item" type="text" value={name || ""} onChange={(e) => {ingredientNameChange(e.target.value, i); setName(e.target.value)}} placeholder="Ingredient" />
        <input className="ingr-item" type="number" value={amount || ""} onChange={(e) => {ingredientAmountChange(e.target.value, i); setAmount(e.target.value)}} placeholder="Amount" />
        <input className="ingr-item" type="text" value={unit || ""} onChange={(e) => {ingredientUnitChange(e.target.value, i); setUnit(e.target.value)}} placeholder="Unit" />
    </div>
}

@inject("NewPostStore")
@observer
class NewPost extends React.Component {
    render() {
        return <>
            { this.props.NewPostStore.showNew
            ?   <div className="new-post">
                    <button className="btn btn-link float-right mr-9 mt-n3" onClick={this.props.NewPostStore.toggleShow}>Cancel</button>
                    <form onSubmit={this.props.NewPostStore.submitClick} className="col-7 mx-auto">
                        <label>Title:<br />
                            <input type="text" value={this.props.NewPostStore.titleValue || ""} onChange={(e) => this.props.NewPostStore.titleChange(e.target.value)} className="width-full py-3 f4" required />
                        </label>
                        <br />
                        <label>Type:<br />
                            <select onChange={(e) => this.props.NewPostStore.typeChange(e.target.value)} className="width-full py-3 f4">
                                <option value="post">Showoff</option>
                                <option value="recipe">Recipe</option>
                            </select>
                        </label>
                        <br />
                        <label>Post privacy:<br />
                            <select onChange={(e) => this.props.NewPostStore.privacyChange(e.target.value)} className="width-full py-3 f4">
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>
                        </label>
                        <br />
                        <label>Image:<br />
                            <input type="file" onChange={(e) => this.props.NewPostStore.imageChange(e.target.files[0])} />
                        </label>
                        <br />
                        <div className="f4">Category:<br /> 
                            {categories.map((category, key) => {
                                return <React.Fragment key={key}>
                                    <div className="btn-checkbox">
                                        <input type="checkbox" name={category} id={category} checked={this.props.NewPostStore.categoriesValue.filter(x => x == category)[0] || false} onChange={(e) => this.props.NewPostStore.categoryChange(e)} value={category} />
                                        <label htmlFor={category}> {firstUpper(category)}</label>
                                    </div>
                                </React.Fragment>   
                            })}
                        </div>
                        <br />
                        <label>Description:<br />
                            <textarea 
                                onChange={(e) => this.props.NewPostStore.descriptionChange(e.target.value)}
                                value={this.props.NewPostStore.descriptionValue || ""}
                                className="width-full py-3 f4"
                                required
                            />
                        </label>
                        <br />
                        {this.props.NewPostStore.typeValue == "recipe" &&
                        <>
                            <label>Ingredients:<br /></label>
                            <div className="ingredients">
                                {this.props.NewPostStore.ingredientsValue.map((ingredient, i) => <Ingredient key={i} ingredient={ingredient} i={i} ingredientNameChange={this.props.NewPostStore.ingredientNameChange} ingredientAmountChange={this.props.NewPostStore.ingredientAmountChange} ingredientUnitChange={this.props.NewPostStore.ingredientUnitChange} />)}
                            </div>
                            <br />
                            <button className="btn btn-default mt-n4 mb-4" onClick={this.props.NewPostStore.addIngredientClick}>Add new ingredient</button><br />
                            <label className="">Directions:<br />
                                <textarea 
                                    onChange={(e) => this.props.NewPostStore.directionsChange(e.target.value)}
                                    value={this.props.NewPostStore.directionsValue || ""}
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
                :   <button className="btn btn-blue-transparent d-block width-full py-4" onClick={this.props.NewPostStore.toggleShow}>New Post</button>
                } 
            </>
    }
}

export default NewPost;