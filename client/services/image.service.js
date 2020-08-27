const url = "https://" + window.location.host + "/api/image";
import {HttpClient} from './';

class ImageService {
    postImage = async (token, data, type, postId) => {
        return await HttpClient.post(url, data, {"token": token, "type": type, "postId": postId});
    }
}

export default ImageService;