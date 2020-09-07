import {observable, action} from 'mobx';
import {AuthStore, DropdownStore} from './';
import { PostsService, ImageService } from '../services';
const path = require('path');

class FormStore {
    constructor(type) {
        this.formType = type;
        this.postsService = new PostsService;
        this.imageService = new ImageService;
        this.authStore = AuthStore;
    }

    @observable postId = null;

    @observable typeStore = new DropdownStore("showoff", 0, this.typeSearch, false);
    @observable privacyStore = new DropdownStore("privacy", 0, this.privacySearch, false);

    typeSearch = (searchPhrase) => {
        return new Promise((resolve, reject) => {
            resolve(["showoff", "recipe"].filter(x=>!x.search(searchPhrase)));
        })
    }
    privacySearch = (searchPhrase) => {
        return new Promise((resolve, reject) => {
            resolve(["private", "public"].filter(x=>!x.search(searchPhrase)));
        })
    }

    @observable showNew = false;

    @action setData = (form, data) => {
        if(data.id) {
            form.$("title").value = data.title;
            form.$("type").value = data.type;
            this.typeStore = new DropdownStore(data.type, 0, this.typeSearch, false);
            form.$("privacy").value = data.isPrivate ? "private" : "public";
            this.privacyStore = new DropdownStore(data.isPrivate ? "private" : "public", 0, this.privacySearch, false);
            form.$("description").value = data.description;
            form.$("categories").value = data.categories;
            if(data.type === "recipe") {
                data.ingredients.map(ingredient => {
                    this.addIngredientClick(null, form.$("ingredients"), ingredient.name, ingredient.amount, ingredient.unit);
                });
                form.$("directions").value = data.directions;
            }
            this.showNew = true;
            this.postId = postId;
        }
    }

    getData = async (postId, form) => {
        const data = await this.postsService.getEditPost(this.authStore.token, postId);
        this.setData(form, data);
    }

    toggleShow = () => {
        this.showNew = !this.showNew;
    }

    addIngredientClick = (event, form, name, amount, unit) => {
        event && event.preventDefault();
        const object = {
            name: name || "",
            amount: amount || "",
            unit: unit || ""
        }
        form.value = [...form.value, object];
    }
    
    submitClick = (values, file, history) => {
        let postObject = {};
        let privacy = values.privacy == "private";

        let data = new FormData();
        data.append('file', file);

        if(values.type === "showoff") {
            postObject = {
                title: values.title,
                type: "post",
                isPrivate: privacy,
                description: values.description,
                categories: values.categories,
            }
            if(file == null) {
                postObject.hasPhoto = false;
            } else {
                postObject.hasPhoto = true;
                postObject.photoExt = path.extname(file.name);
            }
        } else if (values.type === "recipe") {
            postObject = {
                title: values.title,
                type: "recipe",
                isPrivate: privacy,
                description: values.description,
                categories: values.categories,
                ingredients: values.ingredients,
                directions: values.directions
            }
            if(file == null) {
                postObject.hasPhoto = false;
            } else {
                postObject.hasPhoto = true;
                postObject.photoExt = path.extname(file.name);
            }
        }

        if(this.formType === "edit") {
            return this.putPost(postObject, history, data);
        };

        return this.postPost(postObject, data);
    }

    putPost = async (object, history, image) => {
        try { 
            const data = await this.postsService.putPost(this.authStore.token, this.postId, object);
            if (data) {
                if(object.hasPhoto) this.postImage(image, data.id);
                goBack.call(history);
            }
        } catch (error) {
            console.log(error);
        }
    }

    postPost = async (object, image) => {
        try { 
            const data = await this.postsService.postPost(this.authStore.token, object);
            if(data) {
                if(object.hasPhoto) this.postImage(image, data.id);
                else location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }


    postImage = async (object, postId) => {
        try { 
            const data = await this.imageService.postImage(this.authStore.token, object, "post", postId);
            if(data) {
                location.reload();
            }
        } catch (error) {
            console.log(error);
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