export default function (event: any, imgId: string = "editPhoto", imgUrl?: string) {
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
}