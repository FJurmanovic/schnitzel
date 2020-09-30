import {observable, computed, action} from 'mobx';

import {SearchService} from '../services';
import {AuthStore} from './';

class SearchStore {
    textFieldName: string;
    keyFieldName: number;
    searchService: SearchService;
    authStore: typeof AuthStore;
    constructor (textFieldName, keyFieldName) {
        this.textFieldName = textFieldName;
        this.keyFieldName = keyFieldName;
        this.searchService = new SearchService;
        this.authStore = AuthStore;
    }
    @observable isOpen = false;
    @observable fieldArray: Array<any> = [];

    @observable searchPhrase: string = "";

    @computed get isEmpty () {
        return !(this.fieldArray.length > 0);
    }

    @action toggleDropdown = (): void => {
        if(!this.isEmpty && this.searchPhrase !== "") this.isOpen = !this.isOpen;
        if(this.isOpen && !this.fieldArray.length) {
            this.getSearch();
        }
    }

    @action openDropdown = (event): void => {
        if(!this.isEmpty && this.searchPhrase !== "") this.isOpen = true;
    }

    @action closeDropdown = ():void => {
        this.isOpen = false;
    }

    @action phraseChange = (value: string): void => {
        this.searchPhrase = value;
        if(value !== "") {
            this.getSearch();
        }
        else this.isOpen = false;
    }

    textChange = (value: string, key: number): void => {
        this.textFieldName = value;
        this.keyFieldName = key;
        this.toggleDropdown();
    }

    @action setFieldArray = (value: Array<any>): void => {
        this.fieldArray = value || [];
    }

    getSearch = async(): Promise<void> => {
        try {
            const data: any = await this.searchService.getSearch(this.authStore.token, this.searchPhrase);
            this.setFieldArray(data.items);
            this.isOpen = true;
        } catch (error) {
            console.log(error)
        }
    }
}

export default SearchStore;