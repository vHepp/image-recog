const express = require("express");

const app = express();
const port = 5000;

app.use('/', (req,res) => {
	res.send("It works");
})

app.listen(port, () => {
	console.log(`listening on port ${port}`);
})