import {observable, runInAction} from 'mobx';
import {AuthStore, DropdownStore} from './';

class RegisterStore {
    @observable errorMessage = null;
    @observable testDrop = new DropdownStore("Test", 0, this.testFunc, false);

    testFunc = (searchPhrase) => {
        return new Promise((resolve, reject) => {
            resolve(["test", "tost", "test123", "hoola"]);
        })
    }

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