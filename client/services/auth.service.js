const url = "https://" + window.location.host + "/api/user";
import {HttpClient} from './';

class AuthService {
    postLogin = async (object) => {
        return await HttpClient.post(url + "/login", object);
    }
    postRegister = async (object) => {
        return await HttpClient.post(url + "/register", object);
    }
    getData = async (token) => {
        return await HttpClient.get(url + "/data", "", {"token": token});
    }
    putData = async (object, token) => {
        return await HttpClient.put(url + "/data", object, {"token": token});
    }
    getUserData = async (id, token) => {
        return await HttpClient.get(url + "/data/" + id, "", {"token": token});
    }
    getFollowers = async (id, token) => {
        return await HttpClient.get(url + "/data/followers/" + id, "", {"token": token});
    }
    getFollowing = async (id, token) => {
        return await HttpClient.get(url + "/data/following/" + id, "", {"token": token});
    }
    putFollow = async (id, token) => {
        return await HttpClient.put(url + "/follow/" + id, {}, {"token": token});
    }
    deleteFollow = async (id, token) => {
        return await HttpClient.delete(url + "/follow/" + id, {}, {"token": token});
    }
}

export default AuthService;