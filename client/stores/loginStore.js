import {observable, computed} from 'mobx';
import {AuthStore} from './';

class LoginStore {
    @observable emailValue = null;
    @observable passwordValue = null;

    emailChange = (value) => {
        this.emailValue = value;
    }

    passwordChange = (value) => {
        this.passwordValue = value;
    }

    submitClick = (event) => {
        event.preventDefault();
        let loginObject = {
            "email": this.emailValue,
            "password": this.passwordValue
        };

        AuthStore.authLogin(loginObject);
    }

    @computed get token() {
        return AuthStore.token;
    }
}

export default new LoginStore;