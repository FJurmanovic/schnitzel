import {observable, computed, action} from 'mobx';
import {AuthStore} from './';

const path = require('path');

class EditProfileStore {
    @observable usernameValue = null;
    @observable emailValue = null;
    @observable passwordValue = null;
    @observable password2Value = null;
    @observable privacyValue = null;
    @observable editEmail = false;
    @observable editPassword = false;
    @observable editUsername = false;
    @observable editPrivacy = false;
    @observable editAvatar = false;
    @observable selectedFile = null;
    @observable err = [];
    
    @computed get passMatch () {
        return this.passwordValue === this.password2Value;
    }

    @computed get userData () {
        return AuthStore.userData;
    }

    @action toggleUsername = () => this.editUsername = !this.editUsername;
    @action toggleEmail = () => this.editEmail = !this.editEmail;
    @action togglePassword = () => this.editPassword = !this.editPassword;
    @action togglePrivacy = () => this.editPrivacy = !this.editPrivacy;

    toDefault = () => {
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

    emailChange = (value) => {
        this.emailValue = value;
    }

    passwordChange = (value) => {
        this.passwordValue = value;
    }

    password2Change = (value) => {
        this.password2Value = value;
    }

    usernameChange = (value) => {
        this.usernameValue = value;
    }

    privacyChange = (value) => {
        this.privacyValue = value;
    }
    
    imageChange = (value) => {
        this.selectedFile = value;
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
        if(this.selectedFile) {
            editObject.hasPhoto = true;
            editObject.photoExt = path.extname(this.selectedFile.name);

            let data = new FormData();
            data.append('file', this.selectedFile);
            AuthStore.authEdit(editObject, history, data);
            return;
        } 
        
        AuthStore.authEdit(editObject, history);

    }
}

export default new EditProfileStore;