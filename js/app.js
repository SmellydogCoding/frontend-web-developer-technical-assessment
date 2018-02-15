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
  overlay.classList.remove("hidden");
  
  let index = parseInt(event.target.parentNode.parentNode.attributes["data-index"].nodeValue);
  const list = buildImageList();
  
  loadImage(index, list);

  document.getElementsByClassName("prev")[0].addEventListener("click", function() {
    index - 1 < 0 ? index = list.length - 1 : index --
    fadeout(index, list, loadImage);
  });
  
  document.getElementsByClassName("next")[0].addEventListener("click", function() {
    index + 1 > list.length - 1 ? index = 0 : index ++
    fadeout(index, list, loadImage);
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


function fadeout(index, imageList, fadein){
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
  let maxHeight = Math.floor(window.innerHeight * .85);
  if (imageHeight > maxHeight) {
    image.style.height = maxHeight + "px";
    image.style.width = Math.floor(maxHeight * ratio) + "px";
    imageHeight = maxHeight;
    imageWidth = Math.floor(maxHeight * ratio);
  }
  console.log(imageWidth,imageHeight)
  formatLightbox(index,imageList,imageHeight,imageWidth);
}

function formatLightbox(index, imageList, imageHeight, imageWidth) {
  let lightbox = document.getElementsByClassName("image-wrap")[0];
  let lightboxWidth = lightbox.clientWidth;
  let lightboxHeight = lightbox.clientHeight;
  
  let lightboxAnimation = setInterval(function() {
    
    if (imageWidth < lightboxWidth) {
      lightboxWidth -= 1; 
      lightbox.style.width = lightboxWidth + "px"; 
    } else if (imageWidth > lightboxWidth) { 
      lightboxWidth += 1; 
      lightbox.style.width = lightboxWidth + "px"; 
    }
    
    if (imageHeight < lightboxHeight) { 
      lightboxHeight -= 1; 
      lightbox.style.height = lightboxHeight + "px"; 
    } else if (imageHeight  > lightboxHeight) { 
      lightboxHeight += 1; 
      lightbox.style.height = lightboxHeight + "px"; 
    }
    
    if (imageWidth === lightboxWidth && imageHeight === lightboxHeight) { 
      clearInterval(lightboxAnimation);
      fadein(index, imageList);
    }
  }, 1);
}

function fadein(index, imageList) {
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