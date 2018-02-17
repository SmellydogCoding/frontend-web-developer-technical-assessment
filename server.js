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

app.get('/pics', (req,res) => {
  let flickerAPI = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.flickr}&tags=australiancattledog&format=json&per_page=12&nojsoncallback=1`;
  let body = '';
  let request = https.get(flickerAPI, (response) => {
    response.on('data', (data) => {
    body += data;
    });
    response.on('end', () => {
      let gallery = '';
      let pics = JSON.parse(body);
      // build html for flickr photos as long as there are no errors
      if (pics.stat != 'fail') {
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
  });
});

// 404's
app.use((req, res, next) => {
  res.redirect('/');
});

app.listen(port, function() {
  console.log('frontend server is running on port ' + port);
});