import {observable, action} from "mobx";


class ToastStore {
    @observable toasts = [];

    @action push = (toast, color = "#ffffff") => {
        const interval = setInterval(() => {
            if(this.toasts.length) {
                this.toasts.splice(this.toasts.length - 1, 1);
            }
            clearInterval(interval);
        }, 3000);

        this.toasts.push({"text": toast, color, "interval": interval})
    }

    @action remove = (key) => {
        clearInterval(this.toasts[key].interval);
        this.toasts.splice(key, 1);
    }

}

export default new ToastStore();