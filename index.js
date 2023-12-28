require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


// start

let urlContainer = {};
let urls;
let originalUrl;

function CheckUrl(url, res)
{
  originalUrl =  url;

  let responseJson;

  let urlCheck = new URL(originalUrl);
  console.log("\n urlCheck: \n", urlCheck);

  if(urlCheck != undefined && (urlCheck.protocol == "http:" || urlCheck.protocol == "https:"))
  {
    urls = Object.values(urlContainer);
        
    const urlKey = urls.length + 1;
  
    if(urls.includes(originalUrl) == false)
    {
      urlContainer[`${urlKey}`] = originalUrl;
    }
  
    responseJson = { 
      "original_url": originalUrl,
      "short_url": urlKey 
    }
  }
  else
  {
    responseJson = { 
      error: "invalid url" 
    }
  }

  if(responseJson != undefined)
  {
    res.send(responseJson);
  }
  else
  {
    res.send("invalid url format");
  }
};

app.use(bodyParser.urlencoded({extended: false}));

app.post("/api/shorturl", (req, res) => {
  CheckUrl(req.body.url, res);  
});

app.get("/api/shorturl/:short", (req, res) => {
  const short_url = req.params.short;
  if(Object.keys(urlContainer).includes(short_url))
  {
    res.redirect(urlContainer[`${short_url}`]);
  }
});

// end