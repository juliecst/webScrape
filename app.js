const https = require('https');
const JSSoup = require('jssoup').default;
const fs = require('fs');
const url = 'https://en.wikipedia.org/wiki/Spam_(food)'; // FIRST: find a url of a page you are interested in from wikipedia 
const jsonPath = "./json/"; 
const name = "Spam Scrape";
const filteredLinks = [];



/*
This web-scraping example is set up for working with wikipedia.If you want to adapt this
to scrape another site you should go and inspect the site in the browser first, then adapt this. 
*/

//returns one large string of all text
function getParagraphText(soupTag){
    let paragraphs = soupTag.findAll('p');
    let text = [];
    for(let i = 0; i < paragraphs.length; i++){
        let p = paragraphs[i].getText().toLowerCase();
        if(p.indexOf("spam") != -1){
          //  console.log(p);
            text.push(p);
        }
    }
      
        return text;
    }

//a tag challenge
    function getAllExternalLinks(soupTag){
        let aTags = soupTag.findAll('a'); // return an array of SoupTag object
        let links = [];
       
        for(let i = 0; i < aTags.length; i++){
            let attrs = aTags[i].attrs;// get a tag attributes
    
            // if there is an href attribute in attires let's get it
            if('href' in attrs){
                let hrefValue = attrs.href;
            
                if(hrefValue[0] !="#" || "index.php" ){ 
                     //links.push(hrefValue);  // this safes everything to an array
                     //array of pojo should go here --> array.push()
                     //filteredLinks = [];
                     let text = aTags[i].getText();
                     let pojoLink = {
                         "href" : hrefValue,
                         "text" : text
                     }
                      filteredLinks.push(pojoLink);
                }
            }
        }
        //console.log(links)
        console.log(filteredLinks)
    
        return links;
    }

    // //making an array of Pojo; first do an ojbect with text and href
    // //global variable array; 
    // let filteredLinks = [];
    // let text = aTags[i].getText();
    // let pojoLink = {
    //     "href" : href,
    //     "text" : text
    // }
    //  filteredLinks.push(pojoLink);

//pass in Plain Old Javascript Object that's formatted as JSON
function writeJSON(data){
    try {
        let path = jsonPath+name+".json";
        fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
        console.log("JSON file successfully saved");
    } catch (error) {
        console.log("An error has occurred ", error);
    }
}

//create soup  
function createSoup(document){
    
    let soup = new JSSoup(document);
    let data = {
        "name": name,
        "url": url,
        "content": {},
        "linking": []
    }; 

    let main = soup.find('main');//only get the content from the main body of the page
    console.log(main)

   
    
    data.content = {
        "text": getParagraphText (main)
        
       
    };
    data.linking = {
        "links": getAllExternalLinks(main)
    }
    // alternatively: new object thing data.blah and then include data.links
        
    
    //output json
    writeJSON(data);
}




//Request the url
https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
   // console.log('headers:', res.headers);
    
     let document = [];

     res.on('data', (chunk) => {  // if there is data push it into an empty array

         document.push(chunk);
     }).on('end', () => {
         document = Buffer.concat(document).toString();
        // console.log(body);

         //call soup
         createSoup(document);
     });

}).on('error', (e) => {
    console.error(e);
});


        

