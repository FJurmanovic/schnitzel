import {observable, computed} from 'mobx';
import {AuthStore} from './';

const path = require('path');

class NewPostStore {
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
    @observable err = [];

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
        this.err = [];
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

    submitClick = (event, history) => {
        event.preventDefault();
        let editObject = {};

        if(this.editUsername) editObject.username = this.usernameValue;
        if(this.editEmail) editObject.email = this.emailValue;
        if(this.editPassword) {
            if(this.passMatch) {
                editObject.password = this.passwordValue;
            } else {
                this.err.push({"password": "Passwords do not match"});
            }
        }
        if(this.editPrivacy) {
            if (this.privacyValue === "private") {
                editObject.isPrivate = true;
            } else {
                editObject.isPrivate = false;
            }
        }
        if(this.editAvatar) {
            editObject.hasPhoto = true;
            editObject.photoExt = path.extname(this.selectedFile.name);

            let data = new FormData();
            data.append('file', this.selectedFile);
            //AuthStore.uploadImage(data, "avatar");
        }

        AuthStore.authEdit(editObject, history);
    }
}

export default new NewPostStore;

function Ingredient() {
    this.name = null;
    this.amount = null;
    this.unit = null;
}