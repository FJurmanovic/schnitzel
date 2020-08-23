const url = "http://" + window.location.host + "/api/posts";
import {HttpClient} from './';

class PostsService {
    getPosts = async (token, params) => {
        return await HttpClient.get(url, params, {"token": token});
    }
}

export default PostsService;