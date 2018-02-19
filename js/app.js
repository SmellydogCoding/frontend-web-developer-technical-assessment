// get images from Flickr
function getPics() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementsByClassName("loading")[0].classList.add("hidden");
      //error handler
      if (this.responseText === 'error') { 
        let error = document.getElementsByClassName("error")[0];
        let errorHTML = "<img src='img/fail.gif' alt='Flickr Error'><p>It looks like something went wrong with Flickr.&nbsp;&nbsp;Please wait a few minutes and try again.&nbsp;&nbsp;Sorry about that!</p>"
        error.innerHTML = errorHTML;
        error.classList.remove('hidden');
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
  // set default size for the lightbox (which will be resized later)
  // this prevents the odd lightbox sizes if the user closes and then reopens the lighbox with a different picture
  document.getElementsByClassName("image-wrap")[0].style.width = Math.floor(window.innerWidth * .5) + "px";
  document.getElementsByClassName("image-wrap")[0].style.height = Math.floor(window.innerHeight * .5) + "px";
  // prevent scrolling while the lightbox is in use
  document.getElementsByTagName("body")[0].classList.add("noScroll");
  // fade in the overlay and make it visible
  let overlay = document.getElementById("overlay");
  overlay.classList.add("fadein");
  overlay.classList.remove("hidden");
  // index of the image that the user clicked on (this is the starting index)
  let index = parseInt(event.target.parentNode.parentNode.attributes["data-index"].nodeValue);
  const list = buildImageList();
  // load first image into the lightbox (it will not be visible yet)
  let image = document.getElementsByClassName("image")[0];
  image.src = list[index].url;
  image.onload = function() {
    formatImage(index, list);
  }
  // click listener for the back button
  document.getElementsByClassName("prev")[0].addEventListener("click", function() {
    index - 1 < 0 ? index = list.length - 1 : index --
    fadeout(index, list);
  });
  // click listener for the forward button
  document.getElementsByClassName("next")[0].addEventListener("click", function() {
    index + 1 > list.length - 1 ? index = 0 : index ++
    fadeout(index, list);
  });
  // click listener for the close button
  closeLightboxListener();
}

// creates a JSON object with url, title, and link for all of the gallery images
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

// fade out current image and clear image details
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

// load new image (after clicking back or forward button) and image details
function loadImage(index, imageList) {
  let image = document.getElementsByClassName("image")[0];
  image.src = imageList[index].url;
  image.onload = function() {
    formatImage(index, imageList);
  }
}

// get new image dimensions if it is taller that 85% of the window height or 75% of the window width
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

// animation to resize the lightbox to the width of the current image
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

// animation to resize the lightbox to the height of the current image
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
      // use the lightbox height / 2 with 'line-height' to vertically center the back and next buttons
      document.getElementsByClassName("arrow")[0].style["line-height"] = lightboxHeight / 2 + "px";
      document.getElementsByClassName("arrow")[1].style["line-height"] = lightboxHeight / 2 + "px";
      clearInterval(resizeLightboxAnimation);
      loadImageData(imageWidth,imageHeight,index,imageList);
    }
  }, 1);
}

// load image data and resize image using image parameters from the formatImage function
// the lightbox has to be resized before the photo or the lightbox animation will be jumpy
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

// fade the new image in to the resized lightbox
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
    // close the lightbox if someone clicks outside of the image (and not on the back or forward buttons) or clicks the close button
    if(event.target === lightbox || event.target === overlay || event.target === close) {
      overlay.classList.add("fadeout");
      setTimeout(function() {
        // fade out and hide the overlay
        overlay.classList.add("hidden");
        overlay.classList.remove("fadein");
        overlay.classList.remove("fadeout");
        // remove all image data from the lightbox on close
        // if this is not done, if the user closes and then reopens the lightbox with a different picture, there will be image jumping
        image.src = "";
        image.alt = "";
        image.style.cssText = "";
        document.getElementsByClassName("image-wrap")[0].style.cssText = "";
        document.getElementsByClassName("title")[0].innerHTML = "";
        document.getElementsByClassName("flickr-link")[0].href = "";
        document.getElementsByClassName("flickr-link")[0].innerHTML = "";
        // re-enable scrolling
        document.getElementsByTagName("body")[0].classList.remove("noScroll");
      }, 500);
    };
  });
}

// load the imported pictures into #photo and add a click listener to each one
function init() {
  const links = document.getElementsByClassName("photo-link");
  for (let l = 0; l < links.length; l++) {
    links[l].addEventListener("click", launchLightbox);
  };
}

// start this whole crazy show!
window.onload = function() { 
  getPics();
};