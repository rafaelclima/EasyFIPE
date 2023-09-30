const cors = require('cors');
const puppeteer = require('puppeteer');

const express = require('express');
const app = express();

app.use(cors());
app.get('/', async(req , res) => {

  const vehicleBrand = req.query.vehicleBrand;
  const vehicleModel = req.query.vehicleModel;
  const vehicleYear = req.query.vehicleYear;
  
  const srcImg = await getGoogleImage(vehicleBrand, vehicleModel, vehicleYear);
  
  res.send(srcImg);

})

app.listen('3300');

async function getGoogleImage(vehicleBrand, vehicleModel, vehicleYear) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto('https://www.google.com/imghp');

  await page.type('.gLFyf', `${vehicleBrand} ${vehicleModel} ${vehicleYear}`);

  await page.keyboard.down('Enter');
  await page.keyboard.up('Enter');

  await page.waitForNavigation()
  //await page.waitForSelector('.fR600b.islir img');
  // new Promise(r => setTimeout(r, 2500));

  const imgSrc = await page.$eval('.fR600b.islir img', img => img.src);

  await browser.close();
  return imgSrc;
}
