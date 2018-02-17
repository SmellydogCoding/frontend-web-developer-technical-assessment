// get images from Flickr
function loadPics() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if (this.responseText === 'error') { 
        let body = document.getElementsByTagName("body")[0];
        let error = document.createElement('p');
        error.classList.add('error');
        error.innerHTML = "It looks like something went wrong with Flickr.&nbsp;&nbsp;Please wait a few minutes and try again.&nbsp;&nbsp;Sorry about that!"
        body.appendChild(error); 
      }
      else { document.getElementById("photos").innerHTML = this.responseText; }
    }
  };
  xhttp.open("GET", '/pics', true);
  xhttp.addEventListener("load", init);
  xhttp.send();
}

function launchLightbox(event) {
  event.preventDefault();
  document.getElementsByClassName("image-wrap")[0].style.width = Math.floor(window.innerWidth * .5) + "px";
  document.getElementsByClassName("image-wrap")[0].style.height = Math.floor(window.innerHeight * .5) + "px";
  document.getElementsByTagName("body")[0].classList.add("noScroll");
  let overlay = document.getElementById("overlay");
  overlay.classList.add("fadein");
  overlay.classList.remove("hidden");
  
  let index = parseInt(event.target.parentNode.parentNode.attributes["data-index"].nodeValue);
  const list = buildImageList();
  
  // loadImage(index, list);
  let image = document.getElementsByClassName("image")[0];
  image.src = list[index].url;
  image.onload = function() {
    formatImage(index, list);
  }

  document.getElementsByClassName("prev")[0].addEventListener("click", function() {
    index - 1 < 0 ? index = list.length - 1 : index --
    fadeout(index, list);
  });
  
  document.getElementsByClassName("next")[0].addEventListener("click", function() {
    index + 1 > list.length - 1 ? index = 0 : index ++
    fadeout(index, list);
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

function loadImage(index, imageList) {
  let image = document.getElementsByClassName("image")[0];
  image.src = imageList[index].url;
  image.alt = imageList[index].title
  document.getElementsByClassName("title")[0].innerHTML = imageList[index].title;
  document.getElementsByClassName("flickr-link")[0].href = imageList[index].link;
  image.onload = function() {
    formatImage(index, imageList);
  }
}


function fadeout(index, imageList){
  let opacity = 1;
	let image = document.getElementsByClassName("image")[0];
	let timer = setInterval(function() {
    if (opacity <= 0) {
      clearInterval(timer);
      image.style.height = "";
      image.style.width = "";
			loadImage(index, imageList);
		}
		image.style.opacity = opacity;
		opacity -=  0.1;
	}, 30);
}

function formatImage(index, imageList) {
  let image = document.getElementsByClassName("image")[0];
  let imageWidth = image.width;
  let imageHeight = image.height;
  let ratio = imageWidth / imageHeight;
  let maxWidth = Math.floor(window.innerWidth * .75);
  let maxHeight = Math.floor(window.innerHeight * .85);
  if (imageHeight > maxHeight) {
    imageHeight = maxHeight;
    imageWidth = Math.floor(maxHeight * ratio);
  }
  if (imageWidth > maxWidth) {
    resizeLightboxWidth(maxWidth)
    imageWidth = maxWidth;
    imageHeight = Math.floor(maxWidth / ratio);
  }
  resizeLightboxWidth(imageWidth,imageHeight,index,imageList)
}

function resizeLightboxWidth(imageWidth,imageHeight,index,imageList) {
  let lightbox = document.getElementsByClassName("image-wrap")[0];
  let lightboxWidth = lightbox.clientWidth;
  let resizeLightboxAnimation = setInterval(function() {
    if (imageWidth > lightboxWidth) { 
      if (imageWidth - lightboxWidth < 10) { lightboxWidth += (imageWidth - lightboxWidth); }
      else { lightboxWidth += 10; }
      lightbox.style.width = lightboxWidth + "px"; 
    }
    if (imageWidth < lightboxWidth) {
      if(lightboxWidth - imageWidth < 10) { lightboxWidth -= (lightboxWidth - imageWidth); }
      else { lightboxWidth -= 10; }
      lightbox.style.width = lightboxWidth + "px"; 
    } 
    if (imageWidth === lightboxWidth) { 
      clearInterval(resizeLightboxAnimation);
      resizeLightboxHeight(imageWidth,imageHeight,index,imageList)
    }
  }, 1);
}

function resizeLightboxHeight(imageWidth,imageHeight,index,imageList) {
  let lightbox = document.getElementsByClassName("image-wrap")[0];
  let lightboxHeight = lightbox.clientHeight;
  let resizeLightboxAnimation = setInterval(function() {
    if (imageHeight > lightboxHeight) { 
      if (imageHeight - lightboxHeight < 10) { lightboxHeight += (imageHeight - lightboxHeight); }
      else { lightboxHeight += 10; }
      lightbox.style.height = lightboxHeight + "px"; 
    }
    if (imageHeight < lightboxHeight) { 
      if (lightboxHeight - imageHeight < 10) { lightboxHeight -= (lightboxHeight - imageHeight); }
      else { lightboxHeight -= 10; }
      lightbox.style.height = lightboxHeight + "px"; 
    } 
    if (imageHeight === lightboxHeight) { 
      document.getElementsByClassName("arrow")[0].style["line-height"] = lightboxHeight / 2 + "px";
      document.getElementsByClassName("arrow")[1].style["line-height"] = lightboxHeight / 2 + "px";
      clearInterval(resizeLightboxAnimation);
      loadImageData(imageWidth,imageHeight,index,imageList);
    }
  }, 1);
}

function loadImageData(imageWidth,imageHeight,index,imageList) {
  let image = document.getElementsByClassName("image")[0];
  let link = document.getElementsByClassName("flickr-link")[0]
  image.alt = imageList[index].title
  document.getElementsByClassName("title")[0].innerHTML = imageList[index].title;
  link.href = imageList[index].link;
  link.innerHTML = "View Photo on Flickr"
  image.style.width = imageWidth + "px";
  image.style.height = imageHeight + "px";
  fadein(imageWidth,imageHeight,index,imageList);
}

function fadein(imageWidth,imageHeight,index,imageList) {
  let image = document.getElementsByClassName("image")[0];
  let opacity = 0;  // initial opacity
  let timer = setInterval(function() {
    if (opacity >= 1) { clearInterval(timer); }
    document.getElementsByClassName("image")[0].style.opacity = opacity;
    opacity += 0.1;
  }, 30);
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
        overlay.classList.remove("fadein");
        overlay.classList.remove("fadeout");
        image.src = "";
        image.alt = "";
        image.style.cssText = "";
        document.getElementsByClassName("image-wrap")[0].style.cssText = "";
        document.getElementsByClassName("title")[0].innerHTML = "";
        document.getElementsByClassName("flickr-link")[0].href = "";
        document.getElementsByClassName("flickr-link")[0].innerHTML = "";
        document.getElementsByTagName("body")[0].classList.remove("noScroll");
      }, 500);
    };
  });
}

function init() {
  const links = document.getElementsByClassName("photo-link");
  for (let l = 0; l < links.length; l++) {
    links[l].addEventListener("click", launchLightbox);
  };
}

window.onload = function() { 
  loadPics();
};