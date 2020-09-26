import {observable, action} from 'mobx';

class SwitchStore {
    @observable enabled: boolean;
    onClick: Function;
    constructor(current, onClick) {
        this.enabled = current;
        this.onClick = onClick;
    }

    @action setEnabled = (data: boolean): void => {
        this.enabled = data;
    }
    
    toggleClick = (e): void => {
        this.setEnabled(!this.enabled);
        this.onClick(e, !this.enabled);
    }
}

export default SwitchStore;