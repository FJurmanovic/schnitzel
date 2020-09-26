import {observable, computed, action} from 'mobx';
import {AuthStore} from './';

class LoginStore {
    @observable errorMessage = null;

    @action submitClick = async(values, history): Promise<void> => {
        event.preventDefault();
        let loginObject = {
            "email": values.email,
            "password": values.password
        };

        const {message} = await AuthStore.authLogin(loginObject, history);
        this.errorMessage = message;
    }

    @computed get token(): string {
        return AuthStore.token;
    }
}

export default new LoginStore;