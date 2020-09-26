const url:string = "/api/posts";
import {HttpClient} from './';

class PostsService {
    postPost = async (token:string, object:Object): Promise<any> => {
        return await HttpClient.post(url, object, {"token": token});
    }
    putPost = async (token:string, postId:string, object:Object): Promise<any> => {
        return await HttpClient.put(url + `/${postId}`, object, {"token": token});
    }
    getPosts = async (token:string, params:Object): Promise<any> => {
        return await HttpClient.get(url, params, {"token": token});
    }
    getPost = async (token:string, id:string): Promise<any> => {
        return await HttpClient.get(url + `/${id}`, {}, {"token": token});
    }
    getEditPost = async (token:string, id:string): Promise<any> => {
        return await HttpClient.get(url + `/edit-data/${id}`, {}, {"token": token});
    }
    deletePost = async (token:string, postId:string): Promise<any> => {
        return await HttpClient.delete(url + `/${postId}`, {}, {"token": token});
    }
    putPoint = async (token:string, postId:string, object:Object): Promise<any> => {
        return await HttpClient.put(url + "/point/" + postId, object, {"token": token});
    }
    deletePoint = async (token:string, postId:string, object:Object): Promise<any> => {
        return await HttpClient.delete(url + "/point/" + postId, object, {"token": token});
    }
    getComment = async (token:string, params:Object): Promise<any> => {
        return await HttpClient.get(url + "/comment", params, {"token": token});
    }
    postComment = async (token:string, object:Object): Promise<any> => {
        return await HttpClient.post(url + "/comment", object, {"token": token});
    }
    deleteComment = async (token:string, object:Object): Promise<any> => {
        return await HttpClient.delete(url + "/comment", object, {"token": token});
    }
    putComment = async (token:string, object:Object): Promise<any> => {
        return await HttpClient.put(url + "/comment", object, {"token": token});
    }
}

export default PostsService;