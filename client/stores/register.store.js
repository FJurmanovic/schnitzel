import {observable, computed} from 'mobx';
import {AuthStore} from './';

class RegisterStore {
    @observable usernameValue = null;
    @observable emailValue = null;
    @observable email2Value = null;
    @observable passwordValue = null;
    @observable password2Value = null;
    @observable privacy = "private";

    @computed get mailsMatch () {
        return this.emailValue === this.email2Value;
    }

    @computed get passMatch () {
        return this.passwordValue === this.password2Value;
    }

    usernameChange = (value) => {
        this.usernameValue = value;
    }

    emailChange = (value) => {
        this.emailValue = value;
    }

    email2Change = (value) => {
        this.email2Value = value;
    }

    passwordChange = (value) => {
        this.passwordValue = value;
    }

    password2Change = (value) => {
        this.password2Value = value;
    }

    privacyChange = (value) => {
        this.privacy = value;
    }

    submitClick = (event, history) => {
        event.preventDefault();

        const isPrivate = !(this.privacy === "public");

        if(this.mailsMatch && this.passMatch) {
            const registerObject = {
                username: this.usernameValue,
                email: this.emailValue,
                password: this.passwordValue,
                isPrivate: isPrivate
            }
            
            AuthStore.authRegister(registerObject, history);
        }
    }
}

export default new RegisterStore;