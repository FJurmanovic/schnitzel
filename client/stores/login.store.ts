import {observable, computed, runInAction} from 'mobx';
import {AuthStore} from './';

class LoginStore {
    @observable errorMessage = null;

    submitClick = async(values, history) => {
        event.preventDefault();
        let loginObject = {
            "email": values.email,
            "password": values.password
        };

        const {message} = await AuthStore.authLogin(loginObject, history);
        runInAction(() => {
            this.errorMessage = message;
        });
    }

    @computed get token() {
        return AuthStore.token;
    }
}

export default new LoginStore;