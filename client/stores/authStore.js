import {observable, runInAction, computed} from 'mobx';
import {AuthService} from '../services';

class AuthStore {
    constructor() {
        this.authService = new AuthService;
    }

    @observable userData = {};
    @observable token = null;
    @observable status = null;

    @computed get isAuth() {
        return !!this.token;
    }

    authorize = () => {
        this.token = localStorage.getItem("token") || null;
    }

    authLogin = async (loginObject) => {
        try { 
            const data = await this.authService.postLogin(loginObject);
            runInAction(() => {
                if(data.token){
                    this.token = data.token;
                    localStorage.setItem("token", data.token);
                }
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }
}

export default new AuthStore;