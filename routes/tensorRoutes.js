const express = require('express');
const router = express.Router()
const path = require('path')
const fs = require('fs')

const tf = require('@tensorflow/tfjs')
const tfn = require('@tensorflow/tfjs-node')

const handler = tfn.io.fileSystem("./path/to/your/model.json");


const myModelURL = 'M:\\GitHub\\Repos\\image-recog\\Model\\my_custom_model\\model.json'
const testURL = "M:\\GitHub\\Repos\\image-recog\\Model\\my_custom_model\\text.txt"

let model;
/* route: http://localhost:8000/v1/api/tensor/model/getPredictions */
router.get('/model/getPredictions',  (req,res) => {

	console.log("Attemping loading model from route")
	
	model = tf.loadLayersModel(myModelURL)

	console.log("YUH")

	/* fs.readFile(myModelURL, "utf-8", (err, data) => {
		if(err){
			console.log(err)
			return
		}
		res.json(data);
	}) */

	res.send('yo');
	//res.sendFile(myModelURL);

})

module.exports = router