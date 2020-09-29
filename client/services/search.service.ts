const url:string = "/api/search";
import {HttpClient} from './';

class SearchService {
    getSearch = async (token:string, query:string): Promise<any> => {
        return await HttpClient.get(url, {"searchQuery": query}, {"token": token});
    }
}

export default SearchService;