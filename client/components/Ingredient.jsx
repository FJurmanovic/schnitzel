import React from 'react';

export const Ingredient = ({ingredient, i, ingredientNameChange, ingredientAmountChange, ingredientUnitChange}) => {
    const [name, setName] = React.useState(ingredient.name);
    const [amount, setAmount] = React.useState(ingredient.amount);
    const [unit, setUnit] = React.useState(ingredient.unit);

    return <div className="ingredient">
        <input className="ingr-item" type="text" value={name || ""} onChange={(e) => {ingredientNameChange(e.target.value, i); setName(e.target.value)}} placeholder="Ingredient" />
        <input className="ingr-item" type="number" value={amount || ""} onChange={(e) => {ingredientAmountChange(e.target.value, i); setAmount(e.target.value)}} placeholder="Amount" />
        <input className="ingr-item" type="text" value={unit || ""} onChange={(e) => {ingredientUnitChange(e.target.value, i); setUnit(e.target.value)}} placeholder="Unit" />
    </div>
}