const url = "http://" + window.location.host + "/api/posts";
import {HttpClient} from './';

class PostsService {
    postPost = async (token, object) => {
        return await HttpClient.post(url, object, {"token": token});
    }
    putPost = async (token, postId, object) => {
        return await HttpClient.put(url + `/${postId}`, object, {"token": token});
    }
    getPosts = async (token, params) => {
        return await HttpClient.get(url, params, {"token": token});
    }
    getPost = async (token, id) => {
        return await HttpClient.get(url + `/${id}`, {}, {"token": token});
    }
    getEditPost = async (token, id) => {
        return await HttpClient.get(url + `/edit-data/${id}`, {}, {"token": token});
    }
    deletePost = async (token, postId) => {
        return await HttpClient.delete(url + `/${postId}`, {}, {"token": token});
    }
    putPoint = async (token, postId, object) => {
        return await HttpClient.put(url + "/point/" + postId, object, {"token": token});
    }
    deletePoint = async (token, postId, object) => {
        return await HttpClient.delete(url + "/point/" + postId, object, {"token": token});
    }
    getComment = async (token, params) => {
        return await HttpClient.get(url + "/comment", params, {"token": token});
    }
    postComment = async (token, object) => {
        return await HttpClient.post(url + "/comment", object, {"token": token});
    }
}

export default PostsService;