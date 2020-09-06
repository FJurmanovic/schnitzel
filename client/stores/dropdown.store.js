import {observable, runInAction} from 'mobx';

class DropdownStore {
    @observable textFieldName;
    @observable keyFieldName;
    constructor (textFieldName, keyFieldName, fetchFunc, initFetch) {
        this.textFieldName = textFieldName;
        this.keyFieldName = keyFieldName;
        this.fetchFunc = fetchFunc;
        this.initFetch = initFetch;
        if(this.initFetch) {
            this.getSearch();
        }
        this.defaultConstructor = () => {
            this.textFieldName = textFieldName;
            this.keyFieldName = keyFieldName;
            this.fetchFunc = fetchFunc;
            this.initFetch = initFetch;
        }
    }
    @observable isOpen = false;
    @observable fieldArray = [];
    @observable searchPhrase = "";

    toggleDropdown = () => {
        this.isOpen = !this.isOpen;
        if(this.isOpen && !this.initFetch && !this.fieldArray.length) {
            this.getSearch();
        }
    }

    openDropdown = () => {
        this.isOpen = true;
    }

    phraseChange = (value) => {
        this.searchPhrase = value;
        this.getSearch();
    }

    textChange = (value, key) => {
        this.textFieldName = value;
        this.keyFieldName = key;
        this.phraseChange("");
        this.toggleDropdown();
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