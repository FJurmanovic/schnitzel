import {observable, action} from 'mobx';

import {AuthService} from '../services';

import {AuthStore} from './';

class PopoverStore {
    constructor() {
        this.authService = new AuthService;
        this.authStore = AuthStore;
    }

    @observable authorData = {
            id: '',
            postNum: 0,
            username: "username",
            url: ""
    };

    @observable isFetch = false;

    @action setAuthorData = (data) => {
        this.authorData = data;
    }

    @action setIsFetch = (bool) => {
        this.isFetch = bool;
    }
    
    getAuthorData = async(username) => {
        if(!this.isFetch){
            let data = await this.authService.getUserData(username, this.authStore.token);
            if(data) {
                this.setAuthorData(data);
                this.setIsFetch(true);
            }
        }
    }

}

export default PopoverStore;