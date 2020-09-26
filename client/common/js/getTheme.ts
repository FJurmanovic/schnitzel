export const getTheme = (type, mode?) => {
    if(type === "get") {
        let theme = mode || localStorage.getItem("theme") || "dark";
        let body = document.querySelector("body");
    
        if(mode) localStorage.setItem("theme", mode);
    
        if(theme == "dark") body.classList.add("dark");
        else body.classList.remove("dark");
    
        return theme;
    }else if (type === "set") {
        let theme = mode || localStorage.getItem("theme") || "dark";
        let body = document.querySelector("body");

        if(mode) localStorage.setItem("theme", mode);

        if(theme == "dark") body.classList.add("dark");
        else body.classList.remove("dark");
    }else if (type === "getBool") {
        let theme = mode || localStorage.getItem("theme") || "dark";
        return theme == "dark";
    }else if (type === "toggle") {
        let theme = mode || localStorage.getItem("theme") || "dark";
        let body = document.querySelector("body");

        if(theme == "dark") localStorage.setItem("theme", "light");
        else localStorage.setItem("theme", "dark")

        if(theme !== "dark") body.classList.add("dark");
        else body.classList.remove("dark");

    }
}