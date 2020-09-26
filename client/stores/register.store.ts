import {observable, action} from 'mobx';
import {AuthStore} from './';

class RegisterStore {
    @observable errorMessage: string = null;

    @action submitClick = async (values: any, history: any): Promise<void> => {
        event.preventDefault();

        const isPrivate: boolean = !(values.privacy === "Public");
        
        const registerObject = {
            username: values.username,
            email: values.email,
            password: values.password,
            isPrivate: isPrivate
        }

        const {message} = await AuthStore.authRegister(registerObject, history);
        this.errorMessage = message;
    }
}

export default new RegisterStore;