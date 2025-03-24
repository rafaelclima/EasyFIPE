const cors = require("cors");
const puppeteer = require("puppeteer");
const express = require("express");

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
	const { vehicleBrand, vehicleModel, vehicleYear } = req.query;

	try {
		const srcImg = await getGoogleImage(
			vehicleBrand,
			vehicleModel,
			vehicleYear,
		);
		res.send(srcImg);
	} catch (error) {
		console.error("Erro ao buscar imagem:", error);
		res.status(500).send("Erro ao obter a imagem");
	}
});

app.listen(3300, () => console.log("Servidor rodando na porta 3300"));

async function getGoogleImage(vehicleBrand, vehicleModel, vehicleYear) {
	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();

	await page.goto("https://www.google.com/imghp");
	await page.type(".gLFyf", `${vehicleBrand} ${vehicleModel} ${vehicleYear}`);
	await page.keyboard.press("Enter");

	await page.waitForNavigation({ waitUntil: "networkidle2" });

	const imgSrc = await page.$$eval('img[id^="dimg_"]', (imgs) =>
		imgs.length > 0 ? imgs[0].src : null,
	);

	await browser.close();

	if (!imgSrc) {
		throw new Error("Nenhuma imagem encontrada.");
	}

	return imgSrc;
}
