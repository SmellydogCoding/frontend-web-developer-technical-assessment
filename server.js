const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const https = require('https');

try { require('./env.js'); } catch(error) {} // no env file in production environment

app.use('/', express.static(__dirname));

app.get('/', (req,res) => {
  res.sendFile('index.html',{'root': __dirname});
});

app.get('/pics', (req,res, next) => {
  let flickerAPI = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.flickr}&tags=australiancattledog&format=json&per_page=12&nojsoncallback=1`;
  let body = '';
  let request = https.get(flickerAPI, (response) => {
    response.on('data', (data) => {
    body += data;
    });
    response.on('end', () => {
      let gallery = '';
      let pics = '';
      // don't call JSON.parse on the body if the body contains HTML (starts with <!DOCTYPE)  This means there was an error
      body[0] != '<' ? pics = JSON.parse(body) : pics = body;
      // build html for flickr photo gallery as long as there are no errors
      if (pics.stat && pics.stat != 'fail') {
        pics.photos.photo.forEach(function(photo,index) {
          gallery += `<div id="photo${index}" class="photo" data-index=${index} data-owner="${photo.owner}" data-id="${photo.id}">
                        <a class="photo-link" href="https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg">
                          <img src="https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg" alt="Flickr Photo - ${photo.title}"></a>
                        <p>${photo.title}</p>
                      </div>`
        });
      } else { gallery = "error" }
      res.send(gallery);
    });
  }).on('error', (error) => { return next(error); }); // go to error handler if there's no response from Flickr
});

// 404's
app.use((req, res, next) => {
  res.redirect('/');
});

// error handler
app.use((error, req, res, next) => {
  res.send('error');
});

app.listen(port, function() {
  console.log('frontend server is running on port ' + port);
});