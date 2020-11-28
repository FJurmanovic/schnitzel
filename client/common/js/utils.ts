import { ThemeTypes, ThemeModes } from 'Types';

export const firstUpper = (s: string): string => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
};

export const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getTheme = (type: ThemeTypes, mode?: ThemeModes): any => {
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
};

export const loadPhoto = (event: any, imgId: string = "editPhoto", imgUrl?: string) => {
    var output = document.getElementById(imgId);
    if(imgUrl === null) {
      output.removeAttribute("src");
      output.style.display = "none";
    }else {
      output.setAttribute("src", imgUrl ? imgUrl : URL.createObjectURL(event.target.files[0]));
      output.style.display = "inline-block";
    }
    output.onload = function() {
      URL.revokeObjectURL(output.getAttribute("src"));
    }
};

export const scrollToTop = () => {
    window.scrollTo(0,0);
};