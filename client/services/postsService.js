const url = "http://" + window.location.host + "/api/posts";
import {HttpClient} from './';

class PostsService {
    getPosts = async (token, params) => {
        return await HttpClient.get(url, params, {"token": token});
    }
    putPoint = async (token, postId, type) => {
        return await HttpClient.put(url + "/point/" + postId, {type: type}, {"token": token});
    }
    deletePoint = async (token, postId, type) => {
        return await HttpClient.delete(url + "/point/" + postId, {type: type}, {"token": token});
    }
}

export default PostsService;