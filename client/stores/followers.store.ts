import {observable, action} from 'mobx';

class FollowersStore {
    getFollow: Function;
    ownerId: string;
    constructor(getFollow, ownerId) {
        this.getFollow = getFollow;
        this.ownerId = ownerId;
        this.getFollowerData();
    }
    @observable didFetch: boolean = false;
    @observable list: Array<any> = [];

    @action setList = (data: Array<any>): void => {
        this.list = data || [];
    }

    @action setDidFetch = (bool: boolean): void => {
        this.didFetch = bool;
    }
    
    stayHere = (event: any): void => {
        event.stopPropagation();
    }

    getFollowerData = async (): Promise<void> => {
        let data = await this.getFollow(this.ownerId);

        if(data) {
            this.setList(data);
            this.setDidFetch(true);
        }
    }


}

export default FollowersStore;