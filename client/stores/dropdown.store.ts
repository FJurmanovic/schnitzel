import {observable, action} from 'mobx';

class DropdownStore {
    textFieldName: string;
    keyFieldName: number;
    fetchFunc: Function;
    initFetch: boolean;
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
    @observable fieldArray: Array<any> = [];

    searchPhrase: string = "";

    toggleDropdown = (): void => {
        this.isOpen = !this.isOpen;
        if(this.isOpen && !this.initFetch && !this.fieldArray.length) {
            this.getSearch();
        }
    }

    openDropdown = (): void => {
        this.isOpen = true;
        if(!this.initFetch && !this.fieldArray.length) this.getSearch();
    }

    phraseChange = (value: string): void => {
        this.searchPhrase = value;
        this.getSearch();
    }

    textChange = (value: string, key: number): void => {
        this.textFieldName = value;
        this.keyFieldName = key;
        this.phraseChange("");
        this.toggleDropdown();
    }

    @action setFieldArray = (value: Array<any>): void => {
        this.fieldArray = value || [];
    }

    getSearch = async(): Promise<void> => {
        try {
            const data: Array<any> = await this.fetchFunc(this.searchPhrase);
            this.setFieldArray(data);
        } catch (error) {
            console.log(error)
        }
    }
}

export default DropdownStore;