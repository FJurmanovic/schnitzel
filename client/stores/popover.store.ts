import {observable, action} from 'mobx';

import {AuthService} from '../services';

import {AuthStore} from './';

type AuthorType = {
    id: string,
    postNum: number,
    username: string,
    url: string
}

class PopoverStore {
    authService: AuthService;
    authStore: typeof AuthStore;
    constructor() {
        this.authService = new AuthService;
        this.authStore = AuthStore;
    }

    @observable authorData: AuthorType = {
            id: '',
            postNum: 0,
            username: "username",
            url: ""
    };

    @observable isFetch: boolean = false;

    @action setAuthorData = (data: AuthorType): void => {
        this.authorData = data;
    }

    @action setIsFetch = (bool: boolean): void => {
        this.isFetch = bool;
    }
    
    @action getAuthorData = async(username: string): Promise<void> => {
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