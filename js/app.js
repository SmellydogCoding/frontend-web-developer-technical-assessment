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
  // overlay.innerHTML = "";
  const list = buildImageList();
  let index = parseInt(event.target.parentNode.parentNode.attributes["data-index"].nodeValue);
  // let imageBlock = `<figure class="lightbox" data-index="${startIndex}">
  // <div class="image-wrap">
  // <span class="arrow prev">&#8249;</span>
  // <img class="image" src="${imageList[startIndex].url}" alt="${imageList[startIndex].title}">
  // <span class="arrow next">&#8250;</span>
  // </div>
  // <figcaption class="caption">${imageList[startIndex].title}</figcaption>
  // </figure>`
  // overlay.innerHTML = imageBlock;
  loadPicture(index,list)
  overlay.classList.remove("hidden");
  
  document.getElementsByClassName("prev")[0].addEventListener("click", function() {
    index - 1 < 0 ? index = list.length - 1 : index --
    console.log(index)
    loadPicture(index, list);
  });
  document.getElementsByClassName("next")[0].addEventListener("click", function() {
    index + 1 > list.length - 1 ? index = 0 : index ++
    loadPicture(index, list);
  });
  closeLightboxListener();
}

function buildImageList() {
  let images = document.getElementsByClassName('photo');
  let imageList = [];
  for (i = 0; i < images.length; i++) {
    let image = {
      "title": images[i].innerText,
      "url": images[i].firstElementChild.attributes.href.nodeValue
    }
    imageList.push(image);
  }
  return imageList;
}

function loadPicture(index,imageList) {
  document.getElementsByClassName("image")[0].src = imageList[index].url;
  document.getElementsByClassName("image")[0].alt = imageList[index].title;
  document.getElementsByClassName("caption")[0].innerHTML = imageList[index].title;
}

function closeLightboxListener() {
  document.addEventListener("click", function(event) {
    let image = document.getElementsByClassName("image")[0];
    let lightbox = document.getElementsByClassName("lightbox")[0];
    let overlay = document.getElementById("overlay");
    if(event.target === lightbox || event.target === overlay) {
      overlay.classList.add("hidden")
      document.getElementsByTagName("body")[0].classList.remove("noScroll");
    };
  });
}

function init() {
  const links = document.getElementsByClassName("photo-link");
  for (let l = 0; l < links.length; l++) {
    links[l].addEventListener("click", launchModal);
  };
  // document.addEventListener("click", function(event) {
  //   let image = document.getElementsByClassName("image")[0];
  //   if(!image.contains(event.target)) { overlay.classList.add("hidden") };
  //   document.getElementsByTagName("body")[0].classList.remove("noScroll");
  // });
}

window.onload = function() { 
  loadPics();
};