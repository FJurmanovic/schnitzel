import {observable, action} from 'mobx';

class SwitchStore {
    @observable enabled;
    constructor(current, onClick) {
        this.enabled = current;
        this.onClick = onClick;
    }

    @action setEnabled = (data) => {
        this.enabled = data;
    }
    
    toggleClick = (e) => {
        this.setEnabled(!this.enabled);
        this.onClick(e, !this.enabled);
    }
}

export default SwitchStore;