import {observable, computed, action} from 'mobx';
import {AuthStore} from './';

const path = require('path');

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
} | {id?: string, username?: string, email?: string, isPrivate?: boolean}

type TokenType = {
    token: string
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

class EditProfileStore {
    @observable usernameValue: string = null;
    @observable emailValue: string = null;
    @observable passwordValue: string = null;
    @observable password2Value: string = null;
    @observable privacyValue: string = null;
    @observable editEmail: boolean = false;
    @observable editPassword: boolean = false;
    @observable editUsername: boolean = false;
    @observable editPrivacy: boolean = false;
    @observable editAvatar: boolean = false;
    @observable selectedFile: File = null;
    @observable err: Array<any> = [];
    
    @computed get passMatch (): boolean {
        return this.passwordValue === this.password2Value;
    }

    @computed get userData (): UserType {
        return AuthStore.userData;
    }

    @action toggleUsername = (): boolean => this.editUsername = !this.editUsername;
    @action toggleEmail = (): boolean => this.editEmail = !this.editEmail;
    @action togglePassword = (): boolean => this.editPassword = !this.editPassword;
    @action togglePrivacy = (): boolean => this.editPrivacy = !this.editPrivacy;

    @action toDefault = (): void => {
        this.usernameValue = null;
        this.emailValue = null;
        this.passwordValue = null;
        this.password2Value = null;
        this.privacyValue = null;
        this.editEmail = false;
        this.editPassword = false;
        this.editUsername = false;
        this.editPrivacy = false;
        this.editAvatar = false;
        this.selectedFile = null;
        this.err = [];
    }

    @action currentData = (): void => {
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

    @action emailChange = (value: string): void => {
        this.emailValue = value;
    }

    @action passwordChange = (value: string): void => {
        this.passwordValue = value;
    }

    @action password2Change = (value: string): void => {
        this.password2Value = value;
    }

    @action usernameChange = (value: string): void => {
        this.usernameValue = value;
    }

    @action privacyChange = (value: string): void => {
        this.privacyValue = value;
    }
    
    @action imageChange = (value: File): void => {
        this.selectedFile = value;
    }

    @action submitClick = (event: any, history: any): void => {
        event.preventDefault();
        let editObject: AuthType = {};

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
        if(this.selectedFile) {
            editObject.hasPhoto = true;
            editObject.photoExt = path.extname(this.selectedFile.name);

            let data = new FormData();
            data.append('file', this.selectedFile);
            AuthStore.authEdit(editObject, history, data);
            return;
        } 
        
        AuthStore.authEdit(editObject, history, null);

    }
}

export default new EditProfileStore;