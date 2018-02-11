function loadPics() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("photos").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", '/pics', true);
  xhttp.addEventListener("load", addPhotoLinks);
  xhttp.send();
}

function launchModal(event) {
  event.preventDefault();
  let body = document.getElementsByTagName("body");
  let overlay = document.createElement("div");
  overlay.setAttribute("id","overlay");
  overlay.classList.remove("hidden");
  overlay.addEventListener("click", function() { overlay.classList.add("hidden"); });
  body[0].appendChild(overlay);
}

function addPhotoLinks() {
  const links = document.getElementsByClassName("photo-link");
  for (let l = 0; l < links.length; l++) {
    links[l].addEventListener("click", launchModal);
  };
}

window.onload = function() { 
  loadPics();
};