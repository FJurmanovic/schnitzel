const url:string = "/api/image";
import {HttpClient} from './';

class ImageService {
    postImage = async (token: string, data: Object, type: string, postId: string): Promise<any> => {
        return await HttpClient.post(url, data, {"token": token, "type": type, "postId": postId});
    }
}

export default ImageService;