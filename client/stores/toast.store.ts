import {observable, action} from "mobx";


class ToastStore {
    @observable toasts = [];

    @action push = (toast, type = "default") => {
        this.toasts.push({"text": toast, type})
        const interval = setInterval(() => {
            if(this.toasts.length) {
                this.toasts.splice(0, 1);
            }
            clearInterval(interval);
        }, 3000);

    }

    @action remove = (key) => {
        this.toasts.splice(key, 1);
    }

}

export default new ToastStore();