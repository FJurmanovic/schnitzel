import {observable, action} from 'mobx';

class FollowersStore {
    constructor(getFollow, ownerId) {
        this.getFollow = getFollow;
        this.ownerId = ownerId;
        this.getFollowerData();
    }
    @observable didFetch = false;
    @observable list = [];

    @action setList = (data) => {
        this.list = data || [];
    }

    @action setDidFetch = (bool) => {
        this.didFetch = bool;
    }
    
    stayHere = (event) => {
        event.stopPropagation();
    }

    getFollowerData = async () => {
        let data = await this.getFollow(this.ownerId);

        if(data) {
            this.setList(data);
            this.setDidFetch(true);
        }
        return;
    }


}

export default FollowersStore;