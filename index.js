import * as fs from 'node:fs';
import https from 'node:https';
import axios from 'axios';
import * as cheerio from 'cheerio';

if (!fs.existsSync('./memes')) {
  fs.mkdirSync('./memes');
}

const url = 'https://memegen-link-examples-upleveled.netlify.app/';
let emptyArr = [];
// connecting to the url
await axios.get(url).then((response) => {
  const $ = cheerio.load(response.data);
  // getting the images with id #images from html
  const imgUrl = '#images img';
  $(imgUrl).each((_, img) => {
    // pushing URLS into emptyArr
    emptyArr.push($(img).attr('src'));
    return emptyArr;
  });
  //slicing all URL into 10
  const tenImg = emptyArr.slice(0, 10);

  // downloading images and saving into memes folder
  for (let i = 0; i < 10; i++) {
    const images = tenImg[i];
    https.get(images, (res) => {
      const path = `memes/0${i + 1}.jpg`;
      res.pipe(fs.createWriteStream(path));
    });
  }
  console.log('Download Completed Good Job!');
});
