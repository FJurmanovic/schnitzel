export default function (event: any, imgId: string = "editPhoto", imgUrl?: string) {
    var output = document.getElementById(imgId);
    output.setAttribute("src", imgUrl ? imgUrl : URL.createObjectURL(event.target.files[0]));
    output.onload = function() {
      URL.revokeObjectURL(output.getAttribute("src"));
    }
}