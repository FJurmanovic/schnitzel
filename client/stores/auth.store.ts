import {observable, runInAction, computed, action} from 'mobx';
import {AuthService, ImageService} from '../services';

import {ToastStore} from './';

type UserType = {
    username: string,
    url?: string,
    isPrivate: boolean,
    id: string,
    hasPhoto?: boolean,
    following: any[],
    followers: any[],
    email: string,
    createdAt: Date
} | {id?: string}

type TokenType = {
    token?: string,
    message?: string
}

type AuthType = {
    username: string,
    password: string
} | {
    username?: string,
    email?: string,
    password?: string,
    isPrivate?: boolean,
    hasPhoto?: boolean,
    photoExt?: string,
    url?: string
}

type FollowType = [
    {
        userId: string,
        username: string
    }
]

class AuthStore {
    authService: AuthService;
    imageService: ImageService;
    constructor() {
        this.authService = new AuthService;
        this.imageService = new ImageService;
    }

    @observable userData: UserType = {};
    @observable token: string = null;
    @observable status: string = null;
    @observable passedData: boolean = false;
    @observable menuShow: boolean = false; 

    @computed get isAuth(): boolean {
        if (!!this.token) {
            return !!this.userData.id;
        }
        return false;
    }

    @action toggleMenu = (e): void => {
        let menu: any = document.getElementById("profile");
        this.menuShow = !menu.open;
    }

    authorize = (): void => {
        this.token = localStorage.getItem("token") || null;
        this.token && this.authData();
        if(!this.token) this.passedData = true;
    }

    @action authLogin = async (loginObject: AuthType, history: any, callback?: Function): Promise<TokenType>  => {
        try { 
            const data: TokenType = await this.authService.postLogin(loginObject);
            if(data.token){
                this.token = data.token;
                localStorage.setItem("token", data.token);
                this.authorize();
                if (history) history.push("/");
                if(typeof callback == "function") callback();
                ToastStore.push("Logged in", "success");
            }
            return data;
        } catch (error) {
            this.status = "error";
            ToastStore.push("Login failed", "danger");
        }
    }

    @action authRegister = async (registerObject: AuthType, history: any): Promise<TokenType> => {
        try { 
            const data: TokenType = await this.authService.postRegister(registerObject);
            if(data.token){
                this.token = data.token;
                localStorage.setItem("token", data.token);
                this.authorize();
                history.push("/");
                ToastStore.push("User Registered", "success");
            }
            return data;
        } catch (error) {
            console.log(error);
            this.status = "error";
            ToastStore.push("Register failed", "danger");
        }
    }

    @action authEdit = async (editObject: AuthType, history: any, file: FormData): Promise<TokenType> => {
        try { 
            const data: TokenType = await this.authService.putData(editObject, this.token);
            if(data.token){
                this.token = data.token;
                localStorage.setItem("token", data.token);
                this.authorize();
                if(file) this.authAvatar(file, history);
                else history.push('/');
                ToastStore.push("Profile Edited", "success");
            }
            return data;
        } catch (error) {
            console.log(error);
            this.status = "error";
            ToastStore.push("Edit failed", "danger");
        }
    }

    @action authAvatar = async (object: FormData, history: any): Promise<void> => {
        try { 
            const data = await this.imageService.postImage(this.token, object, "avatar", null);
            if(data) {
                history.push("/");
            }
        } catch (error) {
            console.log(error);
                this.status = "error";
                ToastStore.push("Image upload failed", "danger");
        }
    }

    @action authData = async (): Promise<UserType> => {
        try { 
            const data: UserType = await this.authService.getData(this.token);
            if(data.id){
                this.userData = data;
            }
            this.passedData = true;
            return data;
        } catch (error) {
            console.log(error);
            this.status = "error";
            ToastStore.push("Could not get user data", "danger");
        }
    }

    @action authLogout = (): boolean => {
        this.userData = {};
        this.token = null;
        localStorage.removeItem("token");
        ToastStore.push("Logged out", "alert");

        return true;
    }

    @action getFollowers = async(id: string): Promise<FollowType> => {
        try { 
            const data: FollowType = await this.authService.getFollowers(id, this.token);
            return data;
        } catch (error) {
            console.log(error);
            this.status = "error";
            ToastStore.push("Could not get followers", "danger");
        }
    }

    @action getFollowing = async(id: string): Promise<FollowType> => {
        try { 
            const data: FollowType = await this.authService.getFollowing(id, this.token);
            return data;
        } catch (error) {
            console.log(error);
            this.status = "error";
            ToastStore.push("Could not get followers", "danger");
        }
    }

    @action putFollow = async(id: string): Promise<any> => {
        try {
            const data: any = await this.authService.putFollow(id, this.token);
            if(data) ToastStore.push("Follow successful", "success");
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
                ToastStore.push("Could not follow user", "danger");
            });
        }
    }

    @action deleteFollow = async(id: string): Promise<any> => {
        try {
            const data: any = await this.authService.deleteFollow(id, this.token);
            if(data) ToastStore.push("Unfollow successful", "success");
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
                ToastStore.push("Could not unfollow user", "danger");
            });
        }
    }
}

export default new AuthStore;