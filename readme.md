# Frontend Web Developer Technical Assessment

Web application designed to import images from Flickr to create an image gallery and view the images in a lightbox.  
This project was done with pure HTML, CSS, and JavaScript, no jQuery or other libraries were used.

A 'lightbox' basically has to be able to do the following:  

1. Create an overlay over the current items on the page
2. Load an image into the lightbox
3. Have back and forward buttons to change pictures
4. Display some information about the picture
5. Resize if necessary for each picture
6. Close when you click on a close button or click outside the lightbox
7. Animate the above items for a better user experience

Chanllenges that I had to overcome for this project:

1. Internet Explorer 11 - IE 11 does not support async/await, fetch, or promises.  Since I couldn't use jQuery I also couldn't use JSONP.  This means that I couldn't 
make a call to Flickr API from the browser because it violated the cross origin request rule that is build in to the browser.  Because of this I had to create an Express application (though technically I would have had to do this anyway to deploy to Heroku) with a route that I could make a AJAX call to and retrieve the photos.  IE11 also 
uses the older specification of CSS grid so I had to add the required fallbacks to make grid work in IE.  IE also doesn't support template literals or arrow functions.  These are not a big deal to work around, but it's still an annoyance.

2. Flickr photo sizes - Even if query Flickr for photos in a certain size range, you will still get some variance in photo size and aspect ratio.  In order to overcome this I
had to use JavaScript to load the photo at an opacity of 0 (so it's not visible yet), resize the photo in case it's longer or taller than the viewport, resize the lightbox to 
the photo size, then fade the photo in.  I also had to calculate the line height for the back and forward arrows using the lightbox height so that they would be centered at
different viewport sizes.

3. Animation timings - In order to prevent lightbox jumping, image flickering, and other visual anomalies I really had to think about what is happening with each step of the 
process and make sure that all of the steps were executed in the correct order.

Overall I have to say that we have a tendency to really take libraries and frameworks for granted.  It's amazing just how much goes on behind the scenes to make everyday items 
like lightboxes work.

This project is deployed at: [https://frontend-developer-technical.herokuapp.com/](https://frontend-developer-technical.herokuapp.com/ "Frontend Web Developer Technical Assesment")

The Github repository for this project is located at: [https://github.com/SmellydogCoding/frontend-web-developer-technical-assessment](https://github.com/SmellydogCoding/frontend-web-developer-technical-assessment "Github")

For any questions or comments you may email me at: [daniel.mcneil@outlook.com.com](mailto:daniel.mcneil@outlook.com "email me")  

If you like this application please feel free to browse [My Github](https://github.com/SmellydogCoding "My Github") and have a look at some of the other projects that I've done  
or visit [My Portfolio Page](http://www.smellydogcoding.com "My Portfolio") to see my featured projects.

### License
This project is provided as Free and Open Source Software (FOSS) under the terms of the [MIT License](https://opensource.org/licenses/MIT)

### How to Contribute to this Project

#### Download this project

```PowerShell
git clone "https://github.com/SmellydogCoding/frontend-web-developer-technical-assessment.git"
```

#### API Keys
you will need to obtain your own api key from Flickr:

- [Flickr API](https://www.flickr.com/services/api/ "Flickr API")

#### create ENV file

You need to create a **env.js** file in the **root** directory of the project.  

The **env.js** file should contain the following:

```JavaScript
process.env.flickr = 'your key';
```

#### Set up Dev Environment

Install [Node.js](https://nodejs.org/ "NodeJS").  
Make sure that the `node` and `npm` commands have been added to your `PATH` (you may have to do this manually, depending on your OS).

Now open your terminal of choice and navigate to the folder where you cloned the project:  
```PowerShell
>c:\your\path\to\the\frontend-web-developer-technical-assessment
```

Install project dependencies by typing:

```PowerShell
>npm install
```

Start the express server by typing:

```PowerShell
>npm start
```

or if you have **Nodemon** installed

```PowerShell
>nodemon server
```
once the server starts (you will see messages in the console), navigate to [localhost:3000]("http://localhost:3000")