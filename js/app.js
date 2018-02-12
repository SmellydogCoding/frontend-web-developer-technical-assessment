function loadPics() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("photos").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", '/pics', true);
  xhttp.addEventListener("load", init);
  xhttp.send();
}

function launchModal(event) {
  event.preventDefault();
  document.getElementsByTagName("body")[0].classList.add("noScroll");
  let overlay = document.getElementById("overlay");
  overlay.innerHTML = "";

  const imageList = buildImageList();
  let startIndex = event.target.parentNode.parentNode.attributes["data-index"].nodeValue;
  let imageBlock = `<figure>
                      <img src="${imageList[startIndex].url}" alt="${imageList[startIndex].title}">
                      <figcaption>${imageList[startIndex].title}
                    </figure>`

  overlay.innerHTML = imageBlock;
  overlay.classList.remove("hidden");
  
}

function buildImageList() {
  let images = document.getElementsByClassName('photo');
  let imageList = [];
  for (i = 0; i < images.length; i++) {
    let image = {
      // "index": images[i].attributes["data-index"].nodeValue,
      "title": images[i].innerText,
      "url": images[i].firstElementChild.attributes.href.nodeValue
    }
    imageList.push(image);
  }
  return imageList;
}

function init() {
  const links = document.getElementsByClassName("photo-link");
  for (let l = 0; l < links.length; l++) {
    links[l].addEventListener("click", launchModal);
  };
  document.getElementById("overlay").addEventListener("click", function() {
    overlay.classList.add("hidden");
    document.getElementsByTagName("body")[0].classList.remove("noScroll");
  });
}

window.onload = function() { 
  loadPics();
};