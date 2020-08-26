import {observable, computed, runInAction} from 'mobx';
import {AuthStore, PostsStore} from './';
import { PostsService } from '../services';

const path = require('path');

class FormStore {
    constructor(type) {
        this.formType = type;
        this.postsService = new PostsService();
        this.authStore = AuthStore;
    }

    @observable postObject = {};
    @observable postId = null;

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
        this.showNew = false;
        this.err = {};
    }

    getData = async (postId) => {
        const data = await this.postsService.getEditPost(this.authStore.token, postId);
        if(data.id) {
            this.titleValue = data.title;
            this.typeValue = data.type;
            this.privacyValue = data.isPrivate ? "private" : "public" ;
            this.descriptionValue = data.description;
            this.categoriesValue = data.categories;
            this.numIngredientsValue = data.ingredients.length;
            this.ingredientsValue = [...data.ingredients];
            this.directionsValue = data.directions;
            this.showNew = true;
            this.postId = postId;
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

    addIngredientClick = (event) => {
        event.preventDefault();
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
        let postObject = {};
        let privacy = this.privacyValue == "private";

        if(this.validation()) return event.preventDefault();

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

        if(this.formType === "edit") {
            event.preventDefault();
            return this.putPost(postObject, history);
        };

        return this.postPost(postObject);
    }

    putPost = async (object, history) => {
        try { 
            const data = await this.postsService.putPost(this.authStore.token, this.postId, object);
            if (data) {
                goBack.call(history);
            }
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    postPost = async (object) => {
        try { 
            const data = await this.postsService.postPost(this.authStore.token, object);
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    getPost = async (postId) => {
        try { 
            const data = await this.postsService.getPost(this.authStore.token, postId);
            runInAction(() => {
                if(data.id) {
                    this.postObject = data;
                }
            });
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
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
            if(isEmpty(this.ingredientsValue)) err.ingredients.empty = "You need to add at least one ingredient";
            else {
                this.ingredientsValue.forEach((ingredient, key) => {
                    if(ingredient.name == null || ingredient.name.length < 1) {
                        if (!err.ingredients) err.ingredients = []; 
                        err.ingredients[key] = "Ingredient name cannot be empty";
                    }
                });
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

function goBack() {
    if (this.action == "PUSH") return this.goBack();
    return this.push("/");
}