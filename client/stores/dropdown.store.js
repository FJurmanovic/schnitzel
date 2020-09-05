import {observable, computed, runInAction} from 'mobx';

class DropdownStore {
    constructor (textFieldName, keyFieldName, fetchFunc, initFetch) {
        this.textFieldName = textFieldName;
        this.keyFieldName = keyFieldName;
        this.fetchFunc = fetchFunc;
        this.initFetch = initFetch;
        if(this.initFetch) {
            this.getSearch();
        }
    }
    @observable isOpen = false;
    @observable fieldArray = [];
    @observable searchPhrase = "";

    toggleDropdown = () => {
        this.isOpen = !this.isOpen;
    }

    phraseChange = (value) => {
        this.searchPhrase = value;
        this.getSearch();
    }

    getSearch = async() => {
        try {
            const data = await this.fetchFunc(this.searchPhrase);
            runInAction(() => {
                this.fieldArray = data || [];
            });
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            });
        }
    }
}

export default DropdownStore;