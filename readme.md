# Frontend Web Developer Technical Assessment

Web application designed to import images from Flickr to create an image gallery and view the images in a lightbox.  
This project was done with pure HTML, CSS, and JavaScript, no jQuery or other libraries were used.

This project is deployed at: [https://frontend-developer-technical.herokuapp.com/](https://frontend-developer-technical.herokuapp.com/ "Frontend Web Developer Technical Assesment")

The Github repository for this project is located at: [https://github.com/SmellydogCoding/frontend-web-developer-technical-assessment](https://github.com/SmellydogCoding/frontend-web-developer-technical-assessment "Github")

For any questions or comments you may email me at: [daniel.mcneil@outlook.com.com](mailto:daniel.mcneil@outlook.com "email me")  

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