import {observable, action} from 'mobx';
import {AuthStore, DropdownStore} from './';
import { PostsService, ImageService } from '../services';
const path = require('path');

type PostObjectType = {
    title: string,
    type: string,
    isPrivate: boolean,
    description: string,
    categories: string,
    hasPhoto?: boolean,
    photoExt?: string,
    ingredients?: Array<any>,
    directions?: string
}

class FormStore {
    formType: string;
    postsService: PostsService;
    imageService: ImageService;
    authStore: typeof AuthStore;
    constructor(type) {
        this.formType = type;
        this.postsService = new PostsService;
        this.imageService = new ImageService;
        this.authStore = AuthStore;
    }

    @observable postId: string = null;

    typeSearch = (searchPhrase: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            resolve(["showoff", "recipe"].filter(x=>!x.search(searchPhrase)));
        })
    }

    privacySearch = (searchPhrase): Promise<any> => {
        return new Promise((resolve, reject) => {
            resolve(["private", "public"].filter(x=>!x.search(searchPhrase)));
        })
    }

    @observable typeStore: DropdownStore = new DropdownStore("showoff", 0, this.typeSearch, false);
    @observable privacyStore: DropdownStore = new DropdownStore("privacy", 0, this.privacySearch, false);


    @observable showNew: boolean = false;

    @action setData = (form: any, data: any): void => {
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
            this.postId = data.postId;
        }
    }

    getData = async (postId: string, form: any): Promise<void> => {
        const data = await this.postsService.getEditPost(this.authStore.token, postId);
        this.setData(form, data);
    }

    @action toggleShow = (): void => {
        this.showNew = !this.showNew;
    }

    addIngredientClick = (event: any, form: any, name: string, amount: number, unit: string): void => {
        event && event.preventDefault();
        const object = {
            name: name || "",
            amount: amount || 0,
            unit: unit || ""
        }
        form.value = [...form.value, object];
    }
    
    submitClick = (values: any, file: File, history: any): Promise<void> => {
        let postObject: PostObjectType;
        let privacy = values.privacy == "private";

        let data = new FormData();
        data.append('file', file);

        if(values.type === "showoff") {
            postObject = {
                title: values.title,
                type: "post",
                isPrivate: privacy,
                description: values.description,
                categories: values.categories
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

    putPost = async (object: any, history: any, image: FormData): Promise<void> => {
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

    postPost = async (object: any, image: FormData): Promise<void> => {
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


    postImage = async (object: any, postId: string): Promise<void> => {
        try { 
            const data = await this.imageService.postImage(this.authStore.token, object, "post", postId);
            if(data) {
                location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default FormStore;

function goBack() {
    if (this.action == "PUSH") return this.goBack();
    return this.push("/");
}