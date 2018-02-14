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
  // document.getElementById("overlay").addEventListener("mousewheel", function(event) {
  // window.addEventListener("scroll", function(event) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   return false;
  // });
  let overlay = document.getElementById("overlay");
  const list = buildImageList();
  let index = parseInt(event.target.parentNode.parentNode.attributes["data-index"].nodeValue);
  
  overlay.classList.remove("fadeout");
  overlay.classList.remove("hidden");
  overlay.classList.add("fadein");
  loadPicture(index, list);

  document.getElementsByClassName("prev")[0].addEventListener("click", function() {
    index - 1 < 0 ? index = list.length - 1 : index --
    document.getElementsByClassName("image")[0].classList.add("fadeout");
    setTimeout(function() {
      loadPicture(index, list);
    }, 500); 
  });
  document.getElementsByClassName("next")[0].addEventListener("click", function() {
    index + 1 > list.length - 1 ? index = 0 : index ++
    document.getElementsByClassName("image")[0].classList.add("fadeout");
    setTimeout(function() {
      loadPicture(index, list);
    }, 500); 
  });

  closeLightboxListener();
}

function buildImageList() {
  let images = document.getElementsByClassName('photo');
  let imageList = [];
  for (i = 0; i < images.length; i++) {
    let image = {
      "title": images[i].innerText,
      "url": images[i].firstElementChild.attributes.href.nodeValue,
      "link": "https://www.flickr.com/photos/" + images[i].attributes["data-owner"].nodeValue + "/" + images[i].attributes["data-id"].nodeValue
    }
    imageList.push(image);
  }
  return imageList;
}

function loadPicture(index,imageList) {
  document.getElementsByClassName("image")[0].src = imageList[index].url;
  document.getElementsByClassName("image")[0].alt = imageList[index].title;
  document.getElementsByClassName("title")[0].innerHTML = imageList[index].title;
  document.getElementsByClassName("flickr-link")[0].href = imageList[index].link;
  document.getElementsByClassName("image")[0].classList.remove("fadeout");
  document.getElementsByClassName("image")[0].classList.add("fadein");
}

function closeLightboxListener() {
  document.addEventListener("click", function(event) {
    let image = document.getElementsByClassName("image")[0];
    let lightbox = document.getElementsByClassName("lightbox")[0];
    let close = document.getElementsByClassName("close")[0];
    let overlay = document.getElementById("overlay");
    if(event.target === lightbox || event.target === overlay || event.target === close) {
      overlay.classList.add("fadeout");
      setTimeout(function() {
        overlay.classList.add("hidden");
        document.getElementsByTagName("body")[0].classList.remove("noScroll");
      }, 500);
      document.getElementsByClassName("image")[0].classList.add("fadeout");
    };
  });
}

function init() {
  const links = document.getElementsByClassName("photo-link");
  for (let l = 0; l < links.length; l++) {
    links[l].addEventListener("click", launchModal);
  };
}

window.onload = function() { 
  loadPics();
};