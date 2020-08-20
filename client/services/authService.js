const url = "http://" + window.location.host + "/api/user";
import {HttpClient} from './';

class AuthService {
    postLogin = async (object) => {
        return await HttpClient.post(url + "/login", object);
    }
}

export default AuthService;