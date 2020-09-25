import {observable, runInAction, computed} from 'mobx';
import {AuthService, ImageService} from '../services';
class AuthStore {
    constructor() {
        this.authService = new AuthService;
        this.imageService = new ImageService;
    }

    @observable userData = {};
    @observable token = null;
    @observable status = null;
    @observable passedData = false;

    @computed get isAuth() {
        if (!!this.token) {
            return !!this.userData.id;
        }
        return false;
    }

    authorize = () => {
        this.token = localStorage.getItem("token") || null;
        this.token && this.authData();
        if(!this.token) this.passedData = true;
    }

    authLogin = async (loginObject, history, callback) => {
        try { 
            const data = await this.authService.postLogin(loginObject);
            runInAction(() => {
                if(data.token){
                    this.token = data.token;
                    localStorage.setItem("token", data.token);
                    this.authorize();
                    if (history) history.push("/");
                    if(typeof callback == "function") callback();
                }
            })
            return data;
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    authRegister = async (registerObject, history) => {
        try { 
            const data = await this.authService.postRegister(registerObject);
            runInAction(() => {
                if(data.token){
                    this.token = data.token;
                    localStorage.setItem("token", data.token);
                    this.authorize();
                    history.push("/");
                }
            })
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    authEdit = async (editObject, history, file) => {
        try { 
            const data = await this.authService.putData(editObject, this.token);
            runInAction(() => {
                if(data.token){
                    this.token = data.token;
                    localStorage.setItem("token", data.token);
                    this.authorize();
                    if(file) this.authAvatar(file, history);
                    else history.push('/');
                }
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    authAvatar = async (object, history) => {
        try { 
            const data = await this.imageService.postImage(this.token, object, "avatar");
            if(data) {
                history.push("/");
            }
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    authData = async () => {
        try { 
            const data = await this.authService.getData(this.token);
            runInAction(() => {
                if(data.id){
                    this.userData = data;
                }
                this.passedData = true;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    authLogout = () => {
        this.userData = {};
        this.token = null;
        localStorage.removeItem("token");

        return true;
    }

    getFollowers = async(id) => {
        try { 
            const data = await this.authService.getFollowers(id, this.token);
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    getFollowing = async(id) => {
        try { 
            const data = await this.authService.getFollowing(id, this.token);
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    putFollow = async(id) => {
        try {
            const data = await this.authService.putFollow(id, this.token);
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    deleteFollow = async(id) => {
        try {
            const data = await this.authService.deleteFollow(id, this.token);
            return data;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    uploadImage = (object, headers) => {
        try { 
            //await this.authService.postImage(object, headers);
            runInAction(() => {
                console.log("Image uploaded");
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.status = "error";
            });
        }
    }
}

export default new AuthStore;