import {observable, computed} from 'mobx';
import {AuthStore} from './';

const path = require('path');

class FormStore {
    constructor(type) {
        this.formType = type;
    }

    @observable titleValue = null;
    @observable typeValue = "post";
    @observable privacyValue = "private";
    @observable descriptionValue = null;
    @observable categoriesValue = [];
    @observable numIngredientsValue = 1;
    @observable ingredientsValue = [new Ingredient()];
    @observable directionsValue = null;
    @observable isRecipe = false;
    @observable selectedFile = null;
    @observable err = {};

    @observable showNew = false;

    toDefault = () => {
        this.titleValue = null;
        this.typeValue = "post";
        this.privacyValue = "private";
        this.descriptionValue = null;
        this.categoriesValue = [];
        this.numIngredientsValue = 1;
        this.ingredientsValue = [new Ingredient()];
        this.directionsValue = null;
        this.isRecipe = false,
        this.selectedFile = null;
        this.err = {};
    }

    currentData = () => {
        if (this.userData.id) {
            this.usernameValue = this.userData.username;
            this.emailValue = this.userData.email;
            this.passwordValue = null;
            this.password2Value = null;
            if(this.userData.isPrivate) {
                this.privacyValue = "private"; 
            } else {
                this.privacyValue = "public";
            }
        }
    }

    toggleShow = () => {
        this.showNew = !this.showNew;
        if(!this.showNew) this.toDefault(); 
    }

    titleChange = (value) => {
        this.titleValue = value;
    }

    typeChange = (value) => {
        this.typeValue = value;
    }

    privacyChange = (value) => {
        this.privacyValue = value;
    }

    descriptionChange = (value) => {
        this.descriptionValue = value;
    }

    addIngredientClick = () => {
        this.ingredientsValue.push(new Ingredient());
        this.numIngredientsValue++;
    }

    ingredientNameChange = (value, id) => {
        this.ingredientsValue[id].name = value;
    }

    ingredientAmountChange = (value, id) => {
        this.ingredientsValue[id].amount = value;
    }

    ingredientUnitChange = (value, id) => {
        this.ingredientsValue[id].unit = value;
    }

    directionsChange = (value) => {
        this.directionsValue = value;
    }

    imageChange = (value) => {
        this.selectedFile = value;
    }

    categoryChange = (event) => {
        if(event.target.checked){
            this.categoriesValue.push(event.target.name);
        }else{
            this.categoriesValue.splice(this.categoriesValue.findIndex(x => x == event.target.name), 1);
        }
    }

    submitClick = (event) => {
        event.preventDefault();
        let postObject = {};
        let privacy = this.privacyValue == "private";


        if(this.validation()) return;

        let data = new FormData();
        data.append('file', this.selectedFile);

        if(this.typeValue === "post") {
            postObject = {
                title: this.titleValue,
                type: this.typeValue,
                isPrivate: privacy,
                description: this.descriptionValue,
                categories: this.categoriesValue,
            }
            if(this.selectedFile == null) {
                postObject.hasPhoto = false;
            } else {
                postObject.hasPhoto = true;
                postObject.photoExt = path.extname(this.selectedFile.name);
            }
        } else if (this.typeValue === "recipe") {
            postObject = {
                title: this.titleValue,
                type: this.typeValue,
                isPrivate: privacy,
                description: this.descriptionValue,
                categories: this.categoriesValue,
                ingredients: this.ingredientsValue,
                directions: this.directionsValue
            }
            if(this.selectedFile == null) {
                postObject.hasPhoto = false;
            } else {
                postObject.hasPhoto = true;
                postObject.photoExt = path.extname(this.selectedFile.name);
            }
        }

        console.log(postObject);
    }

    validation = () => {
        let err = {};
        this.err = {};
        if(this.titleValue.length < 1) err.title = "Title cannot be blank";
        if(this.descriptionValue.length < 1) err.description = "Description cannot be blank";

        if(this.selectedFile !== null) {
            if(!this.selectedFile.name.match(/.(jpg|jpeg|png|gif)$/i)){
                err.file = "File is not a valid format";
            }
        }
        
        if(this.categoriesValue.length < 1) err.categories = "You need to select at least one category";

        if(this.typeValue === "recipe") {
            if(this.ingredientsValue.length < 1) err.ingredients.empty = "You need to add at least one ingredient";
            else {
                err.ingredients = [];
                this.ingredientsValue.forEach((ingredient, key) => {
                    if(ingredient.name == null || ingredient.name.length < 1) err.ingredients[key] = "Ingredient name cannot be empty";
                })
            }
            if(this.directionsValue.length < 1) err.directions = "Directions cannot be blank";
        }   

        if (!isEmpty(err)) {
            this.err = err;
            console.log(err);
            return true;
        }

        return false;
    }
}

export default FormStore;

function Ingredient() {
    this.name = null;
    this.amount = null;
    this.unit = null;
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}