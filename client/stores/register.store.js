import {observable, runInAction} from 'mobx';
import {AuthStore} from './';

class RegisterStore {
    @observable errorMessage = null;

    submitClick = async (values, history) => {
        event.preventDefault();

        const isPrivate = !(values.privacy === "Public");
        
        const registerObject = {
            username: values.username,
            email: values.email,
            password: values.password,
            isPrivate: isPrivate
        }

        const {message} = await AuthStore.authRegister(registerObject, history);
        runInAction(() => {
            this.errorMessage = message;
        });
    }
}

export default new RegisterStore;