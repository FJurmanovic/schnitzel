import {observable, action} from 'mobx';

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

    searchPhrase = "";

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

    @action setFieldArray = (value) => {
        this.fieldArray = value || [];
    }

    getSearch = async() => {
        try {
            const data = await this.fetchFunc(this.searchPhrase);
            this.setFieldArray(data);
        } catch (error) {
            this.status = "error";
        }
    }
}

export default DropdownStore;