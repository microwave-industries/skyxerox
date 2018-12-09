const express = require('express');
const timeSolver = require('./timesolver');
const copy = require('./skyxerox');

const app = express();

app.get('/suggest/:query', async (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	try {
		let data = await copy.getPlaceSuggestions(req.params.query);
		res.json(data.filter(x => x.id != null));
	} catch (e) {
		res.status(500);
		res.json({ok: false, err: e});
	}
});

app.get('/intersect/:placeA/:placeB/:outbound/:inbound', async (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	try {
		let data = await copy.intersect(req.params.placeA, req.params.placeB, req.params.outbound, req.params.inbound);
		res.json(data);
	} catch (e) {
		res.status(500);
		res.json({ok: false, err: e});
	}
});

app.listen(8080, () => console.log("ready on port 8080."));