import {observable, computed} from 'mobx';
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
        if(this.editPrivacy) editObject.privacy = this.privacyValue;
        if(this.editAvatar) {
            editObject.hasPhoto = true;
            editObject.photoExt = path.extname(this.selectedFile.name);

            let data = new FormData();
            data.append('file', this.selectedFile);
            //AuthStore.uploadImage(data, "avatar");
        }

        AuthStore.authEdit(editObject, history);
    }

    @computed get token() {
        return AuthStore.token;
    }
}

export default new EditProfileStore;